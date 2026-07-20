---
title: "Getting Started"
subtitle: "Learn how to connect to the Susquehanna Valley mesh network"
heroImage: "tbeam.jpg"
attributionUrl: "https://meshtastic.org/"
imageCredit: "Meshtastic"
---

# Welcome to the mesh!

This guide is intended for first-time node buyers and new node owners looking to get their devices up and running on the mesh. It walks through the current options available for nodes, the initial setup process, and where to find help if you encounter issues along the way.

## What You'll Need

To participate in the mesh, you will need a node. A node is a device with a LoRa radio and a microcontroller capable of running the Meshtastic or MeshCore firmware. Pre-built nodes are available from reputable vendors such as [SeeedStudio](https://www.seeedstudio.com/) and [Muzi Works](https://muzi.works/). Alternatively, you can build your own node using development boards from manufacturers like [Heltec](https://heltec.org/) or [RAKWireless](https://www.rakwireless.com/en-us).

### Pre-built Nodes

The following list includes pre-built nodes that have been tested and used successfully by members of the community. These devices offer a range of features, so be sure to compare specifications, particularly battery life, display availability, and the presence of GPS or environmental sensors.

- **SeeedStudio SenseCAP Card Tracker T1000-E**: An excellent starter node. Compact form factor, good battery life, GPS, buzzer, and temperature sensor.
- **Muzi Works R1 Neo**: A premium mobile node featuring fast USB-C charging, GPS, battery safety management, and a built-in buzzer.
- **WisMesh Repeater Mini**: A turnkey option well suited for use as a base node/repeater, with limited modularity for additional sensors.

These are not the only nodes available. Other devices on the market may better match your specific needs or preferences. We encourage you to explore available options and ask for input on our [socials](/socials) if you are unsure which device is right for you.

### Development Boards

Development boards allow you to build a custom node if you purchase or fabricate an enclosure. Broadly, these boards fall into two categories: ESP32-based and nRF52-based.

ESP32-based boards support WiFi connectivity, allowing nodes to connect to your local network. They also offer more onboard storage, which allows more storage of node adverts. For example, ESP32 boards typically support node databases of around 200 entries on Meshtastic, compared to roughly 80 entries on nRF52-based boards. However, ESP32 boards consume significantly more power and are best suited for stationary deployments with consistent power.

nRF52-based boards are far more power efficient, making them ideal for portable nodes and solar-powered installations where battery life is a primary concern. A full list of compatible development boards can be found on [Meshtastic’s website](https://meshtastic.org/docs/hardware/devices/), or in the [MeshCore flasher](https://meshcore.io/flasher).

There are other options as well, most notably low-power ARM boards which are far more capable then the aforementioned. However, these are more involved to setup and are not recommended for newcomers to the mesh. We can't stop you though!

## Which firmware should I use?

Our network now features two different mesh firmwares: Meshtastic and MeshCore. There are a few key differences between the two that may sway your choice in firmware.

### Meshtastic

The key feature of Meshtastic is that all devices participate in message routing by default. This makes Meshtastic useful in remote usage scenarios where you aren't around established infrastructure nodes. Meshtastic also prioritizes telemetry data, so if you are using the mesh for remote sensor data, this is the correct choice. Meshtastic in the SVMesh region has a more mature network, as it's been around for longer, so if you can't get on the mesh in your area using MeshCore, you should try Meshtastic.

### MeshCore

MeshCore utilizes an improved routing setup, where the nodes you carry are not participating in routing packets. This is left to a network of stationary repeater nodes running a separate firmware. The reliance on separate infrastructure nodes mean that paths through the mesh change far less often, allowing MeshCore to reuse paths to avoid flooding the mesh with every message, even direct messages. MeshCore also has a higher number of hops (up to 64) available to route messages, making your theoretical range much farther. However, MeshCore is newer to our area, so coverage in your area may vary. MeshCore also does not prioritize telemetry, in many cases it is fetched manually.

At the end of the day, coverage is the deciding factor. If you can reach one but not the other from your location, then use the one you can reach. Once you get into the hobby, you can consider building a base node for deployment, and help expand the mesh in your area!

## Setting Up Your Node

Once you have your hardware, follow the steps below to get your node online.

::critical[Before Powering On Your Node]
Ensure that a radio antenna is connected to your node before powering it on for the first time. Transmitting without an antenna can damage the radio module, resulting in reduced performance or permanent hardware failure.
::critical

It is strongly recommended to flash your device with the latest firmware before first boot. To do so, visit the [Meshtastic web flasher](https://flasher.meshtastic.org/) or the [MeshCore flasher](https://meshcore.io/flasher), and ensure you select the correct board for your device.

Next, visit our [Meshtastic Settings](/meshtastic-settings) or [MeshCore Settings](/meshcore-settings) guides to apply the current configuration required to join the mesh. After these settings are applied, your node will be fully connected and ready for use. If you have any questions, be sure to reach out on our [socials](/socials)! We are happy to help.
