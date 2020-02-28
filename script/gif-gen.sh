#!/bin/bash
# Generates a gif using ffmpeg
#
# Always overwrites any existing gif.

temp_dir="/tmp/gif/"
out_dir="promo/"
frame_pattern="${temp_dir}frame%004d.png"
palette="/tmp/gif/palette.png"

# Use the hash of the current commit as the name
current_commit=`git rev-parse --short HEAD`
out_filename="${out_dir}${current_commit}.gif"

# First clear the temp files. Don't care if they don't exist.
rm -r "$temp_dir" 2> /dev/null

# output the frames
node build/save-frames.bundle.js --width=500 --height=500 --out="$temp_dir"

# Then bunch them together into a gif! (?)
# Thanks Giphy Engineering!! https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/
ffmpeg -f image2 -i "$frame_pattern" -filter_complex "[0:v] palettegen" -y "$palette"
ffmpeg -f image2 -i "$frame_pattern" -framerate 30 -i $palette -filter_complex "[0:v][1:v] paletteuse" -y "${out_filename}"

# Optimise with gifsicle
gifsicle --optimize --colors=16 "${out_filename}" -o "${out_filename}"
