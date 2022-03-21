# Remote PS3 Controller

## What is Remote PS3 Controller
Remote PS3 Controller is a project that allows you to play PS3 with your friends over the internet. It uses two RPI Picos for simulating the PS3 controller and a Web Socket to send to the player with the PS3 the data from the remote player. The receiving player needs to portfoward or somehow configure a network tunnel for the receiving server to work. 

Also although I have only tested with a PS3 it should work with any platform with minimum modification of the USB Descriptors and the report struct sent to the device. Also if anyone knows how to properly configure USB descriptors especially the PS3 descripters and a proper report to allow all the PS3 controller features let me know.

The Project as the following diagram:

```mermaid
  graph TD
    A(Remote User) -->|Browser| B[Gamepad Website]
    B --> |Internet| C[remote.js Server]
    C --> |USB Serial| D[Receiving Pico]
    D --> |SPI| E[Controller Pico]
    E --> |USB| F[PS3]
    G(Host Player) --> |Normal PS3 Controller| F
```
The program is quite convoluted, there are alot of improvements possible, among them is the the use of only one RPI Pico, or implementing all the functionality of a PS3 controller has currently it doesn't support presure buttons or the PS button. Also the video and audio transmission is not implemented but could be easily fixed by streaming over discord or a platform with less delay, you can find a cheap HDMI to USB receiver on amazon that is more than capable.

## Requirements
  2 Raspberry PI Picos
  
  a PS3
  
  a PC

## Circuit Diagram

![ps3Controller](https://user-images.githubusercontent.com/37073789/159308536-d062687e-74a6-4c4a-88d9-efc8ea53083f.svg)

