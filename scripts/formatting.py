import logging

logger = logging.getLogger('formatting')
logger.setLevel(logging.DEBUG)

def strip_whitespace(s: str):
    logger.debug('stripping whitespace from \'{}\''.format(s))
    return s.strip() \
            .replace('\r\n                        ', ' ') \
            .replace('\n                          ', '') \
            .replace('\n                     ', '') \
            .replace('  ', ' ')

def strip_dash(s: str):
    if not isinstance(s, str):
        logger.error('s was not string: \'{}\', {}'.format(s, s.__class__))
        return s
    logger.debug('stripping dash from {}'.format(s))
    return s.strip() \
            .replace('\u2014', '')
