#!/bin/bash

USER_AGENT="Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0"

for distro in $(cat distrolist.txt);do
    wget -q "https://distrowatch.com/$distro" -O index.html
    logo_url=$(./filter_logo_url.py index.html)
    echo "$distro" "$logo_url"
    rm index.html
done
