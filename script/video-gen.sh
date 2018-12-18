#!/bin/bash
# Generates a video using ffmpeg.
# 
# Will always overwrite any existing file.

set -ex

frame_pattern="/tmp/gif/frame%004d.png"

# output the frames
node build/gif-gen.bundle.js

ffmpeg -f image2 -i "$frame_pattern" -pix_fmt yuv420p -y build/vid.mp4