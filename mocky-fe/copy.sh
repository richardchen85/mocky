#!/bin/bash

version=$(cat package.json | grep -oE "\"version\": \"([0-9.]+)\"" | grep -oE "[0-9.]+")
static=../../misc-clq/mocky/${version}
cp -f ./build/index.html ../mocky-server/app/view/index.nj
rm -rf ${static}
mkdir -p ${static}/static
cp -R -f ./build/static/ ${static}/static