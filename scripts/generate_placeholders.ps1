<#
.SYNOPSIS
This file genrates data to be viewed in readings/poc.html. Run this from ./scripts.
#>

py .\bahaullah_prayers.py "C:\Users\bspriggs\Downloads\Prayers and Meditations by Bahá’u’lláh.xht";
py .\general_prayers.py "C:\Users\bspriggs\Downloads\Bahá’í Prayers.xhtml";
cd ../server;
npm run import:general;
npm run import:bahaullah;
cd ..;
cp server/*.json ./web/static/assets;