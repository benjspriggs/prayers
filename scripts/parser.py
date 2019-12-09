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

def format_categories(category):
    """
    """
    if not isinstance(category, html.HtmlElement):
        raise Exception("I need an HTML ELEMENT!!!", category.__class__)
    __d(category)

    return {
        'title': _t(category, './p[contains(@class, "brl-head")]/text()'),
        'author': _t(category, './p[contains(@class, "brl-italic")]/text()'),
        'texts': [{
            'classes': list(item.classes),
            'text': strip_whitespace(item.text_content())
        } for item in category.xpath('./p[not(contains(@class, "brl-italic")) and not(contains(@class, "brl-head"))]')],
    }

def format_intro_section(intro_section):
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
    """
    if not isinstance(section, html.HtmlElement):
        raise Exception("I need an HTML ELEMENT!!!", section.__class__)

    title = section.xpath('.//h2[contains(@class, "brl-head") and contains(@class, "brl-title")]/text()')
    categories = section.xpath('./div/div[@class="brl-btmmargin"]')
    notes = section.xpath('./div[not(@class)]')

    return {
        'title': list(map(strip_whitespace, title)),
        'notes': list(map(format_notes, notes)),
        'categories': list(map(format_categories, categories))
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
        'sections': list(map(fmt, sections[:1])),
        '__classes': list(classes)
    })

if __name__ == "__main__":
    parsed = parse(sys.argv[1])
    print(json.dumps(parsed, indent=2))