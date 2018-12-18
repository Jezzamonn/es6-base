#!/bin/bash
set -ex

frame_pattern="/tmp/gif/frame%004d.png"

node build/gif-gen.bundle.js

# Node bunch them together into a gif! (?)
ffmpeg -f image2 -framerate 30 -i "$frame_pattern" build/out.gif