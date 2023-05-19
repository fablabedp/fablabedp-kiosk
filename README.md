# FabLab EDP Kiosk


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


Installing systemd services

```
sudo cp fablabedp-kiosk.service /etc/systemd/system/
sudo cp fablabedp-virtualcam.service /etc/systemd/system/
sudo systemctl enable fablabedp-kiosk.service
sudo systemctl enable fablabedp-virtualcam.service
```

Configuring Chromium:

got to: `chrome://flags`
Set `Enable download bubble` to `Enabled`