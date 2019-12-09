"""
Parses an HTML document provided by the https://bahai.org website.

https://www.bahai.org/library/authoritative-texts/prayers/bahai-prayers/
"""
import sys
from lxml import html
import json
import hashlib
import re

# Keeps track of all the available classes in markup.
classes = set()

def strip_whitespace(s: str):
    return s.strip().replace('\r\n                        ', ' ')

def format_book_title(body):
    title = _t(body, '//h1[@class="brl-title"]//text()')
    return ' '.join(title[1:])

def _t(el, selector):
    """
    el: HTMLElement
    selector: str
    """
    if not isinstance(el, html.HtmlElement):
        raise Exception("I need an HTML ELEMENT!!!!", el.__class__)
    return [strip_whitespace(line) for line in el.xpath(selector)]

def pfmt(prayer):
    """
    """
    if not isinstance(prayer, html.HtmlElement):
        raise Exception("I need an HTML ELEMENT!!!", prayer.__class__)

    return {
        'author': None,
        'text': None
    }


def fmt(section):
    """
    """
    if not isinstance(section, html.HtmlElement):
        raise Exception("I need an HTML ELEMENT!!!", section.__class__)

    title = section.xpath('.//h2[contains(@class, "brl-head") and contains(@class, "brl-title")]/text()')
    prayers = []

    return {
        'title': list(map(strip_whitespace, title)),
        'prayers': list(map(pfmt, prayers))
    }

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
    page_level_title = tree.xpath('//div[@class="brl-doc-title"]')[0]
    title = _t(page_level_title, './/h1[@class="brl-title"]/text()')[1]
    subtitle = _t(page_level_title, './/p[@class="brl-subtitle"]/text()')[1]
    sections = body.xpath('.//div[1]')

    return ({
        'hash': {
            'input_encoding': 'utf-8',
            'output_encoding': 'utf-8',
            'algorithm': 'sha256',
            'digest': m.digest().hex(),
            'digest_size': m.digest_size,
            'block_size': m.block_size,
        },
        'title': title,
        'subtitle': subtitle,
        'sections': list(map(fmt, sections)),
        '__classes': list(classes)
    })

if __name__ == "__main__":
    parsed = parse(sys.argv[1])
    print(json.dumps(parsed, indent=2))