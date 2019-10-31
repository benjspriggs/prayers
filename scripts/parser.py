"""
Parses an HTML document provided by the https://bahai.org website.
"""
import sys
from lxml import html

def _(s):
    return s.strip()

def _p(prayers):
    for prayer_string in prayers:
        if prayer_string:
            yield prayer_string

def parse(source):
    tree = html.fromstring(source)

    def _t(selector):
        return [line.strip().replace('\r\n                        ', ' ') for line in tree.xpath(selector)]

    title = _t('//h1[@class="brl-title"]//text()')
    author = _t('//p[@class="brl-subtitle"]/text()')
    notes = _t('//p[@class="brl-doc-byline"]/text()')
    prayers = _t('//p[0 or 1 or 2]/text()')

    print(list({
        'author': author,
        'title': title,
        'notes': notes,
        'prayer': p
    } for p in _p(prayers)))

if __name__ == "__main__":
    source = sys.stdin.buffer.read() 
    parse(source)