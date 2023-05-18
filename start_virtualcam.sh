sudo modprobe v4l2loopback devices=1 exclusive_caps=1,1 video_nr=5
gst-launch-1.0 --no-position libcamerasrc ! capsfilter caps=video/x-raw,width=1728,height=1296,format=NV12 ! v4l2convert ! v4l2sink device=/dev/video5
