# Generates a video using ffmpeg.
# 
# Requires ffmpeg to be installed, and a gif to already have been made.
# Will always overwrite any existing file.
ffmpeg -y -i build/opt.gif -movflags faststart -pix_fmt yuv420p build/vid.mp4