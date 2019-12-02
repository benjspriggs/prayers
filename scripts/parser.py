"""
Parses an HTML document provided by the https://bahai.org website.
"""
import sys
from lxml import html
import json

def parse(source: str):
    """
    Parses the Prayers and Meditations by Baha'u'llah, downloaded from the
    Baha'i Reference Library.

    https://www.bahai.org/library/authoritative-texts/bahaullah/prayers-meditations/
    """
    tree = html.parse(source)

    def _t(el, selector):
        return [line.strip().replace('\r\n                        ', ' ') for line in el.xpath(selector)]

    body = tree.xpath('//*[@class="library-document-content"]')[0]
    title = _t(body, '//h1[@class="brl-title"]//text()')
    author = _t(body, '//p[@class="brl-subtitle"]/text()')
    notes = _t(body, '//p[@class="brl-doc-byline"]/text()')
    sections = body.xpath('//*[@class="brl-btmmargin"]')

    return ({
        'author': author,
        'book_title': title,
        'notes': notes,
        'sections': [{
            'title': _t(section, '//p[contains(@class, "brl-global-selection-number")]/text()'),
            'body': _t(section, '//span[@class="brl-uppercase"]/text()|//p[position() > 1]/text()'),
        } for section in sections]
    })

if __name__ == "__main__":
    parsed = parse(sys.argv[1])
    print(json.dumps(parsed))