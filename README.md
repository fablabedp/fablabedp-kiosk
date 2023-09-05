# FabLab EDP Kiosk


## Usage

open shutdown menu
`crtl + alt + delete`

open terminal
`ctrl + alt + T`

stop kiosk (will restart on reboot)
`sudo systemctl stop fablabedp-kiosk.service`

start kiosk
`sudo systemctl start fablabedp-kiosk.service`

disable kiosk (will not start on boot)
`sudo systemctl disable fablabedp-kiosk.service`

enable kiosk (will autostart on boot)
`sudo systemctl enable fablabedp-kiosk.service`


## Desktop Configuration

Hide/show the taskbar:

`sudo nano /etc/xdg/lxsession/LXDE-pi/autostart`
and comment/uncomment this line:
`# @lxpanel --profile LXDE-pi`

Edit desktop items:
`nano /home/pi/.config/pcmanfm/LXDE-pi/desktop-items-0.conf`

Reboot to enable changes.


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


### Install systemd services

```
sudo cp fablabedp-kiosk.service /etc/systemd/system/
sudo cp fablabedp-virtualcam.service /etc/systemd/system/
sudo systemctl enable fablabedp-kiosk.service
sudo systemctl enable fablabedp-virtualcam.service
```

### Configure and enable backupa

If you want to keep a remote backup of the kiosk, you can use the `backup_kiosk.sh` script.

1. Rename `backup_config.txt.sample` to `backup_config.txt` and update with values with FTP creditials for you backups.  Ensure `MEDIA_DIR` is the same as `MEDIA_PATH` in the app `.env` file.

2. You can schedule the script with cron by editing `crontab -e`, adding this line will run the backup script daily at 12h00, and save a log in the project directory:  
`0 12 * * * cd /home/pi/fablabedp-kiosk && ./backup_kiosk.sh >> backup.log 2>&1`