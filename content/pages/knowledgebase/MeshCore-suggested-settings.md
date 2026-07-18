---
title: MeshCore Suggested Settings
author: techyporcupine
tags: [MeshCore, Guide, Deployment]
---

::info[Information]
Some of these settings are not required, but are starting points that we believe will promote stability and performance in our mesh! It is strongly suggested you apply them, but they are not strictly needed. Feel free to reach out with any questions!
::info

Make sure to save these settings as they're applied! (Checkmark in the top right of MeshCore mobile app.)

## All Nodes

1. Set your node name! Please follow our [Community Guidelines](/socials) when setting this.
1. Set your node to the "USA/Canada (Recommended)" default preset, this is very important!

## Companion Nodes (do "All Nodes" steps first)

1. Set "Transmit Power" to 22.
1. Set a location. Either type coordinates in settings, or enable GPS on capable nodes (Position Settings -> GPS Mode).
1. Set path hashes to 2-byte (Experimental Settings -> Default Path Hash Size).
1. Set a PIN or PIN Type for your node, if applicable (Bluetooth Settings -> Bluetooth Pin Type & Bluetooth Pin).
1. Set Direct Message Acks to 2 (Message Settings -> Direct Message Acks). This improves reliability of acknowledgements for DMs.

## Repeater Nodes (do "All Nodes" steps first)

::warning[Important]
Unless otherwise stated, most of these commands need to be run in the repeater CLI. If a command does not return "OK" you must resend it.
::warning

::info[Note]
Some steps will note specific instructions for openHop users. You _**will**_ know if you are one.
::info

::info[Tip]
Steps 1 through 3 can be done from the GUI or CLI
::info

1. Most nodes: `set tx 22`, for E22P chips `set tx 18` (18 is found to get the most effective power with the PA).
1. Set a location. For a fixed location, run `set lat <degrees>` and `set lon <degrees>` If you have a GPS module, run `gps on` and check the status with `gps`. Run `gps sync` to set the node time, and run `gps setloc` if you want current GPS position to be the fixed location stored. By default, adverts will only share the location stored in your node, and not the GPS location.
1. (Optional) Add Owner Info to repeater. Include helpful info like name, Discord handle, or email address. Someone may contact you if issues arise. `set owner.info <text>` (not available in openHop)
1. Set advert path hashes to 2-byte. `set path.hash.mode 1`
1. Set minimal loop detection. `set loop.detect minimal`
1. Enable powersaving (ONLY do on solar nodes!). `powersaving on`
1. Set advert interval. `set flood.advert.interval 72`
1. Allow periodic radio resets. `set agc.reset.interval 4` (not available in openHop)
1. openHop ONLY: Run CAD Calibration, you MUST run this in the FINAL node location!
1. Send multiple ACKs. `set multi.acks 1` (not available in openHop)
1. Only send adverts 16 hops. `set flood.max.advert 16` (not available in openHop)
1. Set rxdelay. `set rxdelay 3`
1. Set txdelay options
   1. Towers/Mountains: `set txdelay 2` and `set direct.txdelay 2`
   1. Hills/Ridges: `set txdelay 1.5` and `set direct.txdelay 1`
   1. Home Roof/Suburban: `set txdelay 0.8` and `set direct.txdelay 0.4`
   1. Mobile Repeaters (car): `set txdelay 3` and `set direct.txdelay 2.5`
1. Set Region Settings. This will add all the regions and sub-regions we are part of or connected to. (If you are using openHop, make sure you nest the sub-regions correctly by selecting the parent before clicking 'Add Region'. Expected screenshot attached.)
   1. Depending on what firmware is being run, Allow Flood might not be enabled by default. To remedy this, go into the Settings of the Repeater you are on, go into Regions and then hit the '...' beside each entry and pick Allow Flood.

```
region put us
region put us-pa us
region put us-md us
region put lns us-pa
region put mdt us-pa
region put sce us-pa
region put abe us-pa
region put bwi us-md
region save
region
```

<details>
<summary>openHop Screenshot</summary>

![openHop Screenshot](/content/pages/knowledgebase/openhop.webp)

</details>
<br>

::warning[Warning]
Time syncronization in the mesh is very important for a number of reasons. If you node reboots, please re-sync the clock! To avoid a re-sync after every reboot, you can add an RTC or GPS module to your repeater. For RAK repeaters, use the [RAK12002 RTC module](https://store.rakwireless.com/products/rtc-module-rak12002), or the [RAK12500 GPS module](https://store.rakwireless.com/products/wisblock-gnss-location-module-rak12500).
::warning

## Conclusion

Wow! You made it to the end of this guide!! Enjoy the mesh!

Adapted from [Swiss MeshCore](https://www.meshcore.ch/settings/) and [Colorado MeshCore](https://meshcore.coloradomesh.org/guides/repeater-setup)

Created in collaboration with the Susquehanna Valley Mesh community!
