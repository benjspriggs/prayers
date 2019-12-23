"""
Parses an HTML document provided by the https://bahai.org website.

https://www.bahai.org/library/authoritative-texts/prayers/bahai-prayers/
"""
import sys
from lxml import html
import json
import hashlib
import re
from hash import sign, version
from typing import List

# Keeps track of all the available classes in markup.
classes = set()

def __d(h):
    sys.stdout.buffer.write(html.tostring(h))

def strip_whitespace(s: str):
    return s.strip() \
            .replace('\r\n                        ', ' ') \
            .replace('\n                          ', '') \
            .replace('\n                     ', '') \
            .replace('  ', '')

def format_book_title(body):
    title = _t(body, '//h1[@class="brl-title"]//text()')
    return ' '.join(title[1:])

def format_notes(section: html.HtmlElement):
    """
    TODO: format the notes that come at the beginning of a section.
    """
    inst = section.xpath('./div[not(@class)]')

    if not inst:
        return

    return {
        'instructions': list(format_instructions(inst[0])),
    }

def format_instructions(instructions: html.HtmlElement):
    d = {}
    for inst in instructions.xpath('./p'):
        if 'brl-text-smaller1' in inst.classes:
            d['source'] = strip_whitespace(inst.text_content())
            yield d
            d = {}
        else:
            d['text'] = strip_whitespace(inst.text_content())


def _t(el, selector):
    """
    el: HTMLElement
    selector: str
    """
    if not isinstance(el, html.HtmlElement):
        raise Exception("I need an HTML ELEMENT!!!!", el.__class__)
    return [strip_whitespace(line) for line in el.xpath(selector)]

def _update_classes(item: html.HtmlElement):
    classes.update(item.classes)
    return list(item.classes)

def format_categories(categories: List[html.HtmlElement], parent):
    """
    """
    for i, category in enumerate(categories):
        if not isinstance(category, html.HtmlElement):
            raise Exception("I need an HTML ELEMENT!!!", i, category.__class__)

        title = _t(category, './p[contains(@class, "brl-head")]/text()')
        if len(title) == 2:
            title = ' '.join(title[1:])

        author = _t(category, './p[contains(@class, "brl-italic") and not(contains(@class, "brl-firstline-noindent")) and not(contains(@class, "brl-global-instructions"))]/text()')
        if len(author) == 2:
            author = ' '.join(author[1:])

        texts = category.xpath('./p[not(contains(@class, "brl-italic")) and not(contains(@class, "brl-head"))]')
        notes = category.xpath('./p[contains(@class, "brl-global-instructions")]')

        if not texts:
            yield from format_categories(category.xpath('./div'), { 'title': title, '__zeroeth_index': i })
        else:
            yield {
                'title': title,
                'author': author,
                'texts': [{
                    'classes': _update_classes(item),
                    'text': strip_whitespace(item.text_content())
                } for item in texts],
                'parent': parent,
                'notes': [strip_whitespace(note.text_content()) for note in notes],
            }

def format_intro_section(intro_section):
    """
    Formats the intro "sections" which contain a bunch of custom content:
    ```
    div.library-document-content
      div[0]*
    ```
    """
    if not isinstance(intro_section, html.HtmlElement):
        raise Exception("I need an HTML ELEMENT!!!", intro_section.__class__)

    interstitial = intro_section.xpath('.//div[@class="brl-interstitialpage"]')[0]
    in_text = interstitial.xpath('.//p[not(@class)]')
    in_author = interstitial.xpath('.//p[contains(@class, "brl-italic")]')[0]

    intone_text = intro_section.xpath('./div/p[not(@class)]')
    intone_author = intro_section.xpath('./div/p[contains(@class, "brl-italic")]')[0]

    return {
        'title': '__intro__',
        'interstitial': {
            'text': [strip_whitespace(item.text_content()) for item in in_text],
            'author': strip_whitespace(in_author.text_content()),
        },
        'text': [strip_whitespace(item.text_content()) for item in intone_text],
        'author': strip_whitespace(intone_author.text_content())
    }

def fmt(section):
    """
    Formats these "sections" which contain the top-level categories for the general prayers:
    ```
    div.library-document-content
      div[1]
        div*
    ```
    """
    if not isinstance(section, html.HtmlElement):
        raise Exception("I need an HTML ELEMENT!!!", section.__class__)

    section = section.xpath('./div')[0]
    title = section.xpath('.//h2[contains(@class, "brl-head") and contains(@class, "brl-title")]/text()')
    categories = section.xpath('./div')
    notes = section.xpath('./div[not(@class)]')

    return {
        'title': list(map(strip_whitespace, title)),
        'notes': list(map(format_notes, notes)),
        'categories': list(format_categories(categories, title))
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

    body = tree.xpath('//div[@class="library-document-content"]')[0]
    page_level_title = tree.xpath('//div[@class="brl-doc-title"]')[0]
    title = _t(page_level_title, './/h1[@class="brl-title"]/text()')[1]
    subtitle = _t(page_level_title, './/p[@class="brl-subtitle"]/text()')[1]
    intro_section, sections = body.xpath('./*')

    return ({
        'source_version': sign(source),
        'title': title,
        'subtitle': subtitle,
        'sections': [format_intro_section(intro_section)] + list(map(fmt, sections[1:2])),
        '__classes': list(classes)
    })

if __name__ == "__main__":
    parsed = parse(sys.argv[1])
    version(parsed)
    print(json.dumps(parsed))