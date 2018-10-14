#!/bin/bash
usage="Usage: $(basename "$0") title pathname -- Sets up a new web project thing"

if [ "$#" -ne 2 ]; then
    echo "$usage"
    exit 1
fi

title=$1
pathname=$2

scriptdir="$( cd "$(dirname "$0")" ; pwd -P )"
basedir=$(dirname "$scriptdir")

# Clone
git clone -b jez $basedir $pathname || exit 1

# Jump in for some things
cd $pathname

# Copy node_modules
echo 'Copying node_modules...'
cp -R $basedir/node_modules .

# Make this branch be called master
echo 'Renaming branch'
git branch -m master

echo 'Updating remote repos'
git remote rm origin
git remote add upstream $basedir

# Replace {{TITLE}} and {{PATH}} in index.html and scripts/upload.sh
echo 'Updating index.html...'
sed -i '' -e "s/{{TITLE}}/$title/g" index.html
sed -i '' -e "s/{{PATH}}/$pathname/g" index.html

echo 'Updating script/upload.sh...'
sed -i '' -e "s/{{PATH}}/$pathname/g" script/upload.sh

# Commit new change
echo 'Committing changes...'
git add .
git commit -m 'Set project name.'

$scriptdir/git.sh "$pathname" "$title"
