#!/bin/bash
set -ex

frame_pattern="/tmp/gif/frame%004d.png"
palette="/tmp/palette.png"

node build/gif-gen.bundle.js

# Then bunch them together into a gif! (?)
# Thanks Giphy Engineering!! https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/
ffmpeg -f image2 -i "$frame_pattern" -filter_complex "[0:v] palettegen" -y $palette
ffmpeg -f image2 -i "$frame_pattern" -framerate 30 -i $palette -filter_complex "[0:v][1:v] paletteuse" -y build/out.gif