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

if [ -e $pathname ]; then
    echo "$pathname already exists"
    exit 1
fi

# Clone
git clone -b jez $basedir $pathname || exit 1

# Jump in for some things
cd $pathname

# Copy node_modules
echo 'Copying node_modules...'
cp -R $basedir/node_modules .

# TODO: init husky

# Make this branch be called main
echo 'Renaming branch'
git branch -m main

echo 'Updating remote repos'
git remote rm origin
git remote add upstream $basedir

# Replace {{title}} and {{path}} in package.json
echo 'Updating default title/path in package.json...'
sed -i '' -e "s/{{title}}/$title/g" package.json
sed -i '' -e "s/{{path}}/$pathname/g" package.json

# Commit new change
echo 'Committing changes...'
git add .
git commit -m 'Set default page title/path.'

# Reinstall stuff, so the husky commit hooks get added.
npm rebuild

$scriptdir/git.sh "$pathname" "$title"