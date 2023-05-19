# FabLab EDP Kiosk


## Installing

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