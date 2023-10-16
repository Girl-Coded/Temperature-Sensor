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
  Our project approach was segmented into three distinct facets: Hardware, Backend, and Frontend. The Hardware aspect encompassed the physical construction, from selecting optimal components to assembling them within a robust enclosure. In the Backend realm, we delved deep into the embedded systems, formulating logic for Wi-Fi connectivity, sensor data processing, server interactions, and text messaging. Lastly, the Frontend was all about creating a user-centric interface: a website displaying real-time temperature data, offering toggling capabilities, and ensuring seamless client-server communications. In the following subsections, we provide a detailed exploration into each of these areas and their implementation. 

### Hardware
  This section will discuss the hardware components and the wiring design implemented for our circuit project. The primary objective was to create a robust and user-friendly circuit that incorporated a D18B20 1-wire temperature sensor, an I2C display, and a Raspberry Pico microcontroller. Additionally, we integrated a tactile button to toggle the display and implemented a hardware solution to mitigate mechanical bouncing issues.
  
  The D18B20 temperature sensor played a pivotal role in our circuit, serving as our primary means of environmental interaction and ensuring reliable data transmission to our microcontroller. The sensor offered two distinct data transmission modes: direct power delivery, where power was supplied separately, and the commonly used "parasitic power" mode, which uniquely derived power from the same data line used for communication. While parasitic power mode had its advantages, including simplified wiring, synchronized initialization, and reduced power consumption, we chose the normal mode for our project. Normal mode offered faster data collection and transmission with improved response time, as well as greater reliability in terms of the sensor's operating range, compared to the parasitic mode. By selecting normal mode, we aimed to ensure not only a dependable response time for data acquisition but also to mitigate the potential impact of variations in the microcontroller's voltage output, which powered the sensor, and any electrical noise that might interfere with the incoming sensor data.

![Figure4.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure4.png) 

Figure 4: You can see the sensor's pin layout, providing connection details

![Figure5.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure5.png) 

Figure 5: Displays the sensor with its cable

In the realm of hardware considerations, alongside our vital interaction with the environment, we placed substantial emphasis on how we could effectively present data to the user and streamline the interface between the user and the collected information. Our choice of the I2C (Inter-Integrated Circuit) interface held immense significance, mirroring the importance of our environmental interaction. We selected I2C not only for its hardware simplicity compared to alternative display options but also for its widespread compatibility with the majority of commonly used microcontrollers. The core objective of this interface was to present temperature readings to the user seamlessly. By adopting the I2C interface, we achieved a notable reduction in pin and wiring connections to our microcontroller, leading to an overall simplification of hardware complexity. This streamlined approach involved the connection of the Serial Data line, the Serial Clock line, and the provision of a power source. The paramount benefit of embracing an I2C display was the marked reduction in wiring intricacies, enhancing the overall efficiency of our hardware design and making it more user-friendly and space-efficient.

![Figure6.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure6.png) 

Figure 6: Our I2C Display, a crucial component for visualizing data in our circuit

Returning our attention to the core hardware component of our circuit, we meticulously orchestrated connections and interfaces with our microcontroller, aiming beyond the mere management of inputs from the sensor and user interactions via the button. Leveraging the pin layout of our controller to our advantage, we adeptly optimized voltage levels and safeguarded signal integrity, establishing foundational reliability for our circuit during operation. Our user interaction strategy revolved around the microcontroller's interpretation of commands through a thoughtfully integrated button, enabling on-demand activation of the display to conserve power when data presentation was unnecessary.

![Figure7.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure7.png)

Figure 7: An annotated view of the Pico's pins

In our hardware design, we anticipated challenges with mechanical noise when using a pushbutton for user interaction. To counter this, we implemented a hardware-based low-pass filter to control charge flow and its effect on pin logic. This filter included a 10k-ohm resistor (R1) in series with the switch, connected to ground, and a capacitor in parallel, also leading to ground. When the button was pressed, the capacitor discharged gradually through R1, allowing the microcontroller to filter out rapid fluctuations due to mechanical bouncing. Upon button release, the circuit's gradual return to its initial state ensured that noise or bouncing did not impact the input pin's logic level. This low-pass filter effectively enhanced the reliability of our microcontroller's input signal during user interactions.

### Backend
