"""
Parses an HTML document provided by the https://bahai.org website.

https://www.bahai.org/library/authoritative-texts/bahaullah/prayers-meditations/
"""
import sys
from lxml import html
import hashlib
import re
from hash import sign, version

# Keeps track of all the available classes in markup.
classes = set()

def format_section_heading(section):
    t = remove_empty(_t(section, './/p[contains(@class, "brl-global-selection-number")]/text()'))
    return t[0].strip().strip('\u2013').strip()

def format_book_title(body):
    title = _t(body, '//h1[@class="brl-title"]//text()')
    return ' '.join(title[1:])

def format_author(body):
    author = _t(body, '//p[@class="brl-subtitle"]/text()')
    return author[1].lstrip('by ')

def remove_empty(l):
    return list(filter(lambda x: x, l))

def strip_whitespace(s: str):
    return s.strip().replace('\r\n                        ', ' ')

def bfmt(body):
    """
    body: HTMLElement[]
    """
    for b in body:
        classes.update(b.classes)
        yield {
            'classes': list(b.classes),
            'text_content': strip_whitespace(b.text_content())
        }

def fmt(section):
    """
    section: HTMLElement
    TODO: Have this format italicized/ intended sections. (brl-italics, etc)
    """
    body = section.xpath('.//span[@class="brl-uppercase"]|.//p[position() > 1]')

    return {
        'title': format_section_heading(section),
        'body': list(bfmt(body))
    }

def _t(el, selector):
    """
    el: HTMLElement
    selector: str
    """
    return [strip_whitespace(line) for line in el.xpath(selector)]

def parse(source: str):
    """
    Parses the Prayers and Meditations by Baha'u'llah, downloaded from the
    Baha'i Reference Library.

    https://www.bahai.org/library/authoritative-texts/bahaullah/prayers-meditations/
    """
    m = hashlib.sha256()
    m.update(source.encode('utf-8'))

    tree = html.parse(source)

    body = tree.xpath('//*[@class="library-document-content"]')[0]
    title = format_book_title(body)
    author = format_author(body)
    notes = _t(body, '//p[@class="brl-doc-byline"]/text()')[1]
    sections = body.xpath('//*[@class="brl-btmmargin"]')

    return ({
        'source_version': sign(source),
        'author': author,
        'book_title': title,
        'notes': notes,
        'sections': list(map(fmt, sections)),
        '__classes': list(classes)
    })

if __name__ == "__main__":
    parsed = parse(sys.argv[1])
    version(parsed)
    import json
    import os
    dirname = os.path.dirname(__file__)
    filename = os.path.join(dirname, 'bahaullah_prayers.json')
    with open(filename, 'w') as output_file:
        json.dump(parsed, output_file)
