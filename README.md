# lugFreestyle
Linux users group + coca cola freestyle = lugFreestyle

## Installation

To setup run the following:
```
npm install
npm run-script isos # this will take a while
```

Edit 99-thumbdrives.rules so that CHANGEME will be the user that runs the web application before installing.
```
vim 99-thumbdrives.rules
cp 99-thumbdrives.rules /etc/udev/rules.d
udevadm control --reload-rules && udevadm trigger
```

Note: This will change the udev rules for usb devices. If using this on your laptop you may want to undo this in the future.

