<#
.SYNOPSIS
This file genrates data to be viewed in readings/poc.html. Run this from ./scripts.
#>

$ErrorActionPreference = 'Stop';

py .\bahaullah_prayers.py "./bahaullah.xht";

if (-not $?) {
    throw 'Error'
}

py .\general_prayers.py "./general_prayers.xhtml";

if (-not $?) {
    throw 'Error'
}

npm run --prefix ../server import:general;

if (-not $?) {
    throw 'Error'
}

npm run --prefix ../server import:bahaullah;
if (-not $?) {
    throw 'Error'
}

cp ../server/*.json ../web/static/assets;