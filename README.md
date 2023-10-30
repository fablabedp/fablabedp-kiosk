# FabLab EDP Kiosk

We built this kiosk to register projects and users at our FabLab, providing a project gallery and records of human and machine hours.  Users can upload media, register hours, leave updates and feedback, and give a final project evaluation. It also includes a photobooth tool that lets you take photos with the kiosk and associate them with projects or leave them in the photobooth gallery.

The kiosk hardware uses a Raspberry Pi 4 in a CNC machined PVC stand.  We designed a version using the Raspberry Pi 7in touch display, but ended up using a standard 21in lcd monitor, with a shelf for mouse and keyboard.  A  Raspberry Pi Camera Module 3 is used for the photobooth.

The kiosk software is built with Node.js and uses a [LokiJS](https://github.com/techfort/LokiJS) database.  Due to issues accessing the Raspberry Pi Camera from Chromium, we also had to use gstreamer with a v4l2loopback device for the photobooth, see [#set-up-raspberry-pi-camera-for-use-in-chromium](#set-up-raspberry-pi-camera-for-use-in-chromium).


This repo also contains systemd unit files to manage autostarting the kiosk app and the v4l2loopback device.  There is also a shell script that can be used to create automatic remote backups of the kiosk database and media files via FTP.


## Installing

### Update Raspberry Pi OS and install Git

```
sudo apt update
sudo apt upgrade
sudo apt install git
```

### Install Node.js

```
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs
```

### Install the kiosk app

```
git clone https://github.com/fablabedp/fablabedp-kiosk.git
cd fablabedp-kiosk/kiosk_app/
npm install
```

### Configure the app enviroment variables

In the `kiosk_app` folder, rename `.env.sample` to `.env` and edit variables as needed.

If you need to change the port number, this must also be updated in `start_kiosk.sh`.


### Set up Raspberry Pi Camera for use in Chromium

I had problems getting the Raspberry Pi Camera to work as a capture device in Chromium browser, see these issues:  
https://github.com/raspberrypi/linux/issues/1498  
https://bugs.chromium.org/p/chromium/issues/detail?id=249953  

The solution I found was to use gstreamer and create a v4l2loopback device:  
https://forums.raspberrypi.com/viewtopic.php?p=1939455  
https://forums.raspberrypi.com/viewtopic.php?t=323401  
https://raspberrypi.stackexchange.com/questions/42727/raspbian-v4l2loopback/143021  
https://arcoresearchgroup.wordpress.com/2020/06/02/virtual-camera-for-opencv-using-v4l2loopback/  

I first needed to install  the Raspberry Pi Kernal Headers:  
`sudo apt-get install raspberrypi-kernel-headers`  

Then install gstreamer and v4l2loopback module, and create the loopback device:  
```
sudo apt-get install v4l2loopback-dkms gstreamer1.0-tools
v4l2-ctl --list-devices
sudo rmmod v4l2loopback
sudo modprobe v4l2loopback devices=1 exclusive_caps=1,1 video_nr=5 card_label="VirtualCam"
```

### Install systemd services

```
sudo cp fablabedp-kiosk.service /etc/systemd/system/
sudo cp fablabedp-virtualcam.service /etc/systemd/system/
sudo systemctl enable fablabedp-kiosk.service
sudo systemctl enable fablabedp-virtualcam.service
```

## Desktop Configuration

Hide/show the taskbar:

`sudo nano /etc/xdg/lxsession/LXDE-pi/autostart`
and comment/uncomment this line:
`# @lxpanel --profile LXDE-pi`

Edit desktop items:
`nano /home/pi/.config/pcmanfm/LXDE-pi/desktop-items-0.conf`

Reboot to enable changes.


### Configure and enable backups

If you want to keep a remote backup of the kiosk, you can use the `backup_kiosk.sh` script.

1. Rename `backup_config.txt.sample` to `backup_config.txt` and update with values with FTP creditials for your backups.  Ensure `MEDIA_DIR` is the same as `MEDIA_PATH` in the app `.env` file.

2. You can schedule the script with cron by editing `crontab -e`, adding this line will run the backup script daily at 12h00, and save a log in the project directory:  
`0 12 * * * cd /home/pi/fablabedp-kiosk && ./backup_kiosk.sh >> backup.log 2>&1`


## Usage

### Raspberry Pi OS hotkeys

open shutdown menu
`crtl + alt + delete`

open terminal
`ctrl + alt + T`

### Systemd commands

stop kiosk (will restart on reboot)
`sudo systemctl stop fablabedp-kiosk.service`

start kiosk
`sudo systemctl start fablabedp-kiosk.service`

disable kiosk (will not start on boot)
`sudo systemctl disable fablabedp-kiosk.service`

enable kiosk (will autostart on boot)
`sudo systemctl enable fablabedp-kiosk.service`
