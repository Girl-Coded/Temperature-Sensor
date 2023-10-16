# Temperature-Sensor

## Objective: 
In this lab, our goal was to design a web-enabled thermometer device that satisfies a set of specific functional and mechanical requirements. The overall goal was to prototype a robust and versatile device that could accurately measure and display temperature, interfacing with both a computer and mobile phone.

## Design Documentation 
Shown below are tables organizing the list of components and requirements for the lab. 

![Tables.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Tables.png)

![Figure1.jpg](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure1.jpg) Figure 1: Simplified overhead circuit design 

![Figure2.jpg](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure2.jpg) Figure 2: Wiring Schematic for Temperature sensor project

![Figure3.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure3.png) Figure 3: Overall System Flow Chart

For overall system architecture, we followed a 3-layer IoT structure (Perception-Network-Application). The peripherals shown above as well as a pushbutton and switch live on a breadboard. We constructed sound housing for the hardware to ensure a robust container. The connection to the broker lives on the main.py file on the Pico W. From there, we had the client-server structure set up on VSCode, with the corresponding packages needed for an Express server and a React app. 

## Design Process and Experimentation
