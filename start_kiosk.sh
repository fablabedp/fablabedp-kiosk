#!/bin/bash
/usr/bin/python -m http.server &
/usr/bin/chromium-browser --kiosk --disable-restore-session-state http://localhost:8000