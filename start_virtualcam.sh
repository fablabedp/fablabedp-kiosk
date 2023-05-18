#!/bin/bash
sudo modprobe v4l2loopback devices=1 exclusive_caps=1,1 video_nr=5
gst-launch-1.0 --no-position libcamerasrc ! capsfilter caps=video/x-raw,width=1728,height=1296,format=NV12 ! v4l2convert ! v4l2sink device=/dev/video5
# some tested resolutions for Raspberry Pi Camera Module 3:
# 4608 x 2592 full resolution (16:9)
# 2592 x 1944 (4:3)
# 1728 x 1296 (4:3)
# 1728 x 972 (16:9)
