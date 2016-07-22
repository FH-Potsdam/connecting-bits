# Demonstration
The following documents how to setup the transl8r for the first time, how to start the software, how to stop it and how to restart it.

# Initial setup
- Turn on the mac mini
- With another computer connect over ssh via the terminal to the mac mini. 
To do so run ``ssh admin@172.16.42.27`` and enter the password provided on the post-it sticked on the mac mini's packaging.
- Make sure the mac mini is connected to the Interface Lab wifi. Try ``ping fh-potsdam.de`` and if you see something like ``cannot resolve fh-potsdam.de: Unknown host`` then the connection to the wifi is not working. If this is the case, follow [these instructions](http://blog.mattcrampton.com/post/64144666914/managing-wifi-connections-using-the-mac-osx).
- Make sure the mac mini's bluetooth is off. Run ``blueutil off``.
- Run ``cd ~/Projects/transl8r`` and ``nvm use 6.2.0``.
- To start the sofware, make sure that the hardware is set up and that the photons are ready (LEDs show a blue/white light) then run ``npm run watch``
- To exit the code, hit ``ctrl`` + ``c`` on your keyboard.
- To restart the software, just navigate with the ``top arrow`` key once and run ``npm run watch`` again

# Troubleshooting
The following documents the experienced issues happening while demoing it and provides instructions for troubleshooting purposes.

## Logging
When you start the software, you will be shown log informations to help you understand what's going on. These log informations are colour coded for different purposes:

- **blue**: Generic information
- **magenta**: Hardware related information
- **green**: Shiftr  related information
- **red**: Error
- **orange**: Warning
- **gray**: Discrete low prior information
- **white**: Uncategorized information

The color coded log informations are displayed with a title (text on a rectangle) with additional, detailled data. Other log informations that does not satisfy this format are whether comming from libraries used in the software or concern errors.

## Common issues

### Not all boards are ready
All four photon boards must emmit a "ready" event so that the programm can start. If one or more Photon board isn't sending this event, the software hangs up. This can be caused when:

- **A Photon is separated from the power supply and is off**: Look at the power connections on the board. The board should show a blue/white light and should not blink, look like RG**B** blue or R**G**B green
- **A Photon is taking longer to reach the ready mode**: In this case just wait a bit. Restart the programm.
- **A message like "Make sure you properly flashed the board" is displayed**: Restart the programm. If the message remains you need to flash the board again (look at the section "Photon board needs to be flashed again" below).
- **A Photon does not achieve to connect to the internet**: This is mostly recognizable when the photon board blinks a lot and quickly. In this case turn it off and on again. If the Problem remains, flash it again and if it still doesn't help, reconfigure it from scratch. (Call me because I need to remove it from my particle.io account)

### API limit reached
If an error message tells about some API limit reached, you need to create a second account for this API and change the keys in the config file. For example, google translate reaches its limit:

- Go to google translate [api's website](https://cloud.google.com/translate/) and click on "console" on the top right edge of the screen.
- Login with your google account
- Select your new project in your google console page
- Click on the hamburger icon on the top left edge of the screen and then on something like "Manage APIs"
- Enable google translate API and activate it
- Go to somthing like "Identifiers"
- Create one API key for servers, name it and add the ip address of the mac mini. If you don't now it, ignore this step for now as it will throw an error later saying that the ip address XXX of the mac mini is not set up in the project and that you should add it, so do it then.
- An API key will be shown. Somthing like ``AIzaSyBNiRrg-NKYta6u9l4q2ZJ6-qoNPfMIL_k``. Replace this key in the relevant place in the json file placed in ``~/Projects/transl8r/config/default.json``.
- Run the programm again with ``npm run watch``

### Photon board need to be flashed again
- Connect the Photon via usb to the mac mini or to your own computer.
- Clone the voodoospark firmware. To do so run ``git clone git@github.com:voodootikigod/voodoospark.git ~/voodoospark ; cd ~/voodoospark/firmware``.
- Run ``particle cloud flash <NAME_OF_THE_BOARD_LOOK_IN_THE_DEFAULT_JSON_FILE_IN_CONFIG_FOLDER> voodoospark.cpp voodoospark.h``. Make sure that [particle-cli is installed](https://github.com/voodootikigod/voodoospark#loading-the-firmware) on the computer the Photon board is connect to.
- Run ``cd ~/Projects/transl8r`` and ``nvm use 6.2.0``.
- Run the programm again with ``npm run watch``

### Hanging sofware after recording
This happens when the recording could not be turned into words or when nobody has spoken somehting in the microphone. In this case just restart the programm with ``npm run watch``.
