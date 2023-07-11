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

Update Raspberry Pi OS and install Git

```
sudo apt update
sudo apt upgrade
sudo apt install git
```


Installing Node.js

```
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs
```


Installing the Kiosk app
```
git clone https://github.com/fablabedp/fablabedp-kiosk.git
cd fablabedp-kiosk/kiosk_app/
npm install

```

Configuring Enviroment Variables

rename `.env.sample` to `.env` and edit variables as needed


Installing systemd services

```
sudo cp fablabedp-kiosk.service /etc/systemd/system/
sudo cp fablabedp-virtualcam.service /etc/systemd/system/
sudo systemctl enable fablabedp-kiosk.service
sudo systemctl enable fablabedp-virtualcam.service
```
