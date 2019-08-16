
#!/bin/bash
#
# Re-records all the gifs from the first comment

# Get all the commit messages from the initial commit (inclusive)
hashes=$(git log --oneline | sed '/Set default page title/q' | \
# Remove the initial commit
sed '$ d' | \
# Pull out just the hashes
awk '{print $1}')

for hash in $hashes
do
    git checkout "$hash"
    npm run build
    npm run gif
done