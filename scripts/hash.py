import hashlib
import json
import copy

def version(content: dict) -> None:
    s = sign(json.dumps(content))
    content.update(s)

def sign(content: str) -> dict:
    if not isinstance(content, str):
        raise Exception('content must be a string, was', content.__class__)

    m = hashlib.sha256()
    m.update(content.encode('utf-8'))

    return {
        'hash': {
            'input_encoding': 'utf-8',
            'algorithm': 'sha256',
            'digest': m.digest().hex(),
            'digest_size': m.digest_size,
            'block_size': m.block_size,
        },
    }