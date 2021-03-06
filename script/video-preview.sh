#!/bin/bash
# Generates a video using ffmpeg
#
# Always overwrites any existing gif.

rand_id=$(uuidgen)
temp_dir="/tmp/vid/$rand_id/"
out_dir="promo/"
frame_pattern="${temp_dir}frame%004d.png"
palette="/tmp/gif/palette.png"

# Use the hash of the current commit as the name
current_commit=`git rev-parse --short HEAD`
out_filename="${out_dir}${current_commit}.mp4"

# First clear the temp files. Don't care if they don't exist.
rm -r "$temp_dir" 2> /dev/null

# output the frames
node build/save-frames.bundle.js --width=500 --height=500 --fps=30 --sub_frames=1 --out="$temp_dir"

# Convert frames to video. Output error to stdout because... it's noisy?
ffmpeg -f image2 -framerate 30 -i "$frame_pattern" -pix_fmt yuv420p -y "${out_filename}" 2>&1
