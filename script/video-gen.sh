#!/bin/bash
# Generates a video using ffmpeg
#
# Always overwrites any existing gif.

temp_dir="/tmp/gif/"
frame_pattern="${temp_dir}frame%004d.png"
palette="/tmp/gif/palette.png"

# First clear the temp files. Don't care if they don't exist.
rm -r "$temp_dir" 2> /dev/null

# output the frames
node build/gif-gen.bundle.js

ffmpeg -f image2 -i "$frame_pattern" -pix_fmt yuv420p -y build/vid.mp4