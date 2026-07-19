---
title: "MeshCore Settings"
subtitle: ""
heroImage: "tbeam.jpg"
attributionUrl: ""
---

# Required Settings

These settings are the only ones that are necessary to connect to the mesh.

| Option          | Recommended Config         | Notes                                                               |
| --------------- | -------------------------- | ------------------------------------------------------------------- |
| Node name       | Set a unique node name     | Follow our [Community Guidelines](/socials) when setting this.      |
| Regional preset | `USA/Canada (Recommended)` | This is required for compatibility with the local MeshCore network. |

# Recommended Settings

These settings are _not_ required for broadcasting on the mesh. However, these settings have been curated and tested across multiple active meshes and are tuned for performance and quality-of-life. We highly recommend utilizing these settings on your nodes!

## Companion Nodes

| Option                 | Recommended Config | Notes                                                                                           |
| ---------------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| Transmit Power         | `22`               |                                                                                                 |
| Location               | Set fixed location | Enter coordinates manually, or enable GPS on supported nodes (`Position Settings -> GPS Mode`). |
| Default Path Hash Size | `2-byte`           | Found at `Experimental Settings -> Default Path Hash Size`                                      |
| Bluetooth PIN          | Set PIN/PIN Type   | If applicable: `Bluetooth Settings -> Bluetooth Pin Type` and `Bluetooth Pin`.                  |
| Direct Message Acks    | `2`                | Found at `Message Settings -> Direct Message Acks`; improves DM acknowledgement reliability.    |

## Repeater Nodes

Unless otherwise stated, the commands below must be executed in the repeater command line. This can be done via the MeshCore app via a companion node or via USB through the MeshCore Repeater/Room Server Setup found on the [web flasher](https://meshcore.io/flasher). If you don't get an `OK` response from the repeater when running the below commands, run the command again.

::info[Note]
Some of the below settings have specific instruction for openHop users. If you don't know whether or not you're using openHop, you aren't.
::info

| Option                  | Recommended Config                            | Notes                                                                                                                                           |
| ----------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Transmit Power          | Most nodes: `set tx 22`; E22P: `set tx 18`    | Using `18` on E22P chips gives the most effective PA output. Can be set via GUI.                                                                |
| Location                | Set fixed location or GPS-based location      | Fixed: `set lat <degrees>` + `set lon <degrees>`. GPS: `gps on`, verify with `gps`, then `gps sync`; optional `gps setloc`. Can be set via GUI. |
| Owner Info (optional)   | `set owner.info <text>`                       | Include contact info (name, Discord handle, or email) so operators can reach you if issues arise. Not available in openHop. Can be set via GUI. |
| Path Hash Mode          | `set path.hash.mode 1`                        | Sets advert path hashes to 2-byte.                                                                                                              |
| Loop Detection          | `set loop.detect minimal`                     |                                                                                                                                                 |
| Powersaving             | `powersaving on`                              | Only enable on solar-powered repeater nodes.                                                                                                    |
| Advert Interval         | `set flood.advert.interval 72`                |                                                                                                                                                 |
| AGC Reset Interval      | `set agc.reset.interval 4`                    | Allows periodic radio resets. Not available in openHop.                                                                                         |
| openHop CAD Calibration | Run CAD Calibration at final install location | openHop only; you must run this at the final node location.                                                                                     |
| Multi ACKs              | `set multi.acks 1`                            | Not available in openHop.                                                                                                                       |
| Max Advert Hops         | `set flood.max.advert 16`                     | Not available in openHop.                                                                                                                       |
| RX Delay                | `set rxdelay 3`                               |                                                                                                                                                 |

### TX Delay Profiles

| Deployment Type        | TX Delay Command  | Direct TX Delay Command  |
| ---------------------- | ----------------- | ------------------------ |
| Towers/Mountains       | `set txdelay 2`   | `set direct.txdelay 2`   |
| Hills/Ridges           | `set txdelay 1.5` | `set direct.txdelay 1`   |
| Home Roof/Suburban     | `set txdelay 0.8` | `set direct.txdelay 0.4` |
| Mobile Repeaters (car) | `set txdelay 3`   | `set direct.txdelay 2.5` |

### Region Settings

Set Region Settings to add all regions and sub-regions we are part of or connected to. If you are using openHop, make sure you nest sub-regions correctly by selecting the parent before clicking `Add Region`.

Depending on firmware, `Allow Flood` might not be enabled by default. If needed, open your repeater `Settings`, go to `Regions`, then click the `...` beside each entry and enable `Allow Flood`.

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

![openHop Screenshot](/images/openhop.webp)

</details>
<br>

::warning[Warning]
Time syncronization in the mesh is very important for a number of reasons. If your node reboots, please re-sync the clock! To avoid a re-sync after every reboot, you can add an RTC or GPS module to your repeater. For RAK repeaters, use the [RAK12002 RTC module](https://store.rakwireless.com/products/rtc-module-rak12002), or the [RAK12500 GPS module](https://store.rakwireless.com/products/wisblock-gnss-location-module-rak12500).
::warning

## Conclusion

If you've applied all of the above, thank you! You have improved mesh reliability for you and others in your area. Enjoy the mesh!

Adapted from [Swiss MeshCore](https://www.meshcore.ch/settings/) and [Colorado MeshCore](https://meshcore.coloradomesh.org/guides/repeater-setup)

Created in collaboration with the Susquehanna Valley Mesh community!
