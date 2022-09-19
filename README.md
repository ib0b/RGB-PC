# RGB-PC

## Introduction

RGB-PC is a bluetooth based client for Govee LED strips. This is based on reverse engineering the requests from android and translating them to PC. Thanks to [BeauJBurroughs/Govee-H6127-Reverse-Engineering](https://github.com/BeauJBurroughs/Govee-H6127-Reverse-Engineering) and [egold555/Govee-Reverse-Engineering](https://github.com/egold555/Govee-Reverse-Engineering)

<img width="1116" alt="image" src="https://user-images.githubusercontent.com/18010106/191063691-08d27f1a-8714-44f3-9e35-912833e3f391.png">

### Features

- [x] Keep alive
- [x] On/Off toggle
- [x] Change Color
- [x] Set global brightness
- [x] Music Modes
- [x] Change Scenes
- [x] Send Custom Command
- [x] Sync Colors to your display border,each segement with different focus area. <em>~Experimental</em>

---

## A Message to Govee

> In the U.S., Section 103(f) of the Digital Millennium Copyright Act (DMCA) [(17 USC § 1201 (f) - Reverse Engineering)](https://www.law.cornell.edu/uscode/text/17/1201) specifically states that it is legal to reverse engineer and circumvent the protection to achieve interoperability between computer programs (such as information transfer between applications). Interoperability is defined in paragraph 4 of Section 103(f).
>
> It is also often lawful to reverse-engineer an artifact or process as long as it is obtained legitimately. If the software is patented, it doesn't necessarily need to be reverse-engineered, as patents require a public disclosure of invention. It should be mentioned that, just because a piece of software is patented, that does not mean the entire thing is patented; there may be parts that remain undisclosed.

If @Govee you would like me to take this down, please contact me view email or create an issue on this repository.

## Download

See the [releases page](https://github.com/ib0b/RGB-PC/releases)

## How to Use

<ol>
  <li>Open RGB-PC</li>
  <li>Click scan, you should have a bluetooth enable PC/Laptop</li>
  <li>Connect to you govee device.</li>
  <li>A menu should appear with the settings of the led controller.</li>
  <li>For video sync, use the segment buttons to identify the segment numbers along the strip, and input them based on location then Click [SAVE].Choose the screen/display if you have multiple displays. Then click [Sync Colors] to start sync</li>
</ol>

## Known issues

- They video sync mode is slow, because the controller has an internal queue that is dequeued approx 50ms, hence can only be updated about every 500ms (for every 15 sections for some strips), to avoid huge backlog of messages in the controller queue.
- Does not support all devices, use with caution. Sending wrong bluetooth command is unlikely to ruin your controller, but still possible.

## Need help on improvements

- Faster video sync implementation,the new UDP/LAN API sadly does not have individual section command.(Even if it did, it's highly likely that the strip controller has a queue, which is the main bottleneck)
- More CPU efficient color analyser.
- Add support for more controllers.

## Building the app (for customisations)

```
clone repo
npm install
npm run start

#building the app , change targets in vue.config.js
npm run build
```

## Contributing and issues

Please check known issues first and create an issue with reproduceable steps.

## Reverse Engineering

You can capture the bluetooth traffic from your android device and old one works best (Android 4.4 - 6.0) and the view the logs using Wireshark
See these links for more information:
- [How to capture Bluetooth packets on Android 4.4](https://www.nowsecure.com/blog/2017/02/07/bluetooth-packet-capture-on-android-4-4/)
- [How to capture Bluetooth traffic from and to an Android Device?](https://support.honeywellaidc.com/s/article/How-to-capture-Bluetooth-traffic-from-and-to-an-Android-Device)
