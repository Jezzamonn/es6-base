#!/bin/bash
# Generates a gif using ffmpeg
#
# Always overwrites any existing gif.

temp_dir="/tmp/gif/"
frame_pattern="${temp_dir}frame%004d.png"
palette="/tmp/gif/palette.png"

# First clear the temp files. Don't care if they don't exist.
rm -r "$temp_dir" 2> /dev/null

# output the frames
node build/gif-gen.bundle.js

# Then bunch them together into a gif! (?)
# Thanks Giphy Engineering!! https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/
ffmpeg -f image2 -i "$frame_pattern" -filter_complex "[0:v] palettegen" -y "$palette"
ffmpeg -f image2 -i "$frame_pattern" -framerate 30 -i $palette -filter_complex "[0:v][1:v] paletteuse" -y build/out.gif