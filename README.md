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
In the backend development phase, we approached challenges sequentially. Our first task was configuring the Raspberry Pi Pico W for Wi-Fi connectivity. We opted for Thonny as our development environment and utilized MicroPython for programming the Pico. The datasheet provided clear instructions on establishing a Wi-Fi connection using MicroPython, which we followed meticulously. After successfully setting up and testing the Wi-Fi, we turned our focus to implementing the Mobile Phone Alerts feature.
To implement the Mobile Phone Alerts feature, we began by researching the most suitable platforms. We settled on Twilio due to its versatility and user-friendly nature. Additionally, their free trial provided ample messaging capabilities for our needs. We further explored its implementation by watching instructional YouTube videos. The image provided below illustrates a successful message exchange between the Pico and a mobile device. The functions used for internet connectivity and text messaging are found in the `sms_internet.py` script.

![Figure8.jpg](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure8.jpg)

Figure 8: Successful Mobile Message 

After completing the initial tasks, our next focus was data formatting. We leveraged the on-board temperature sensor provided by the Pico to record data every second and display the temperature on the console. This preliminary step was crucial for two reasons: it enabled us to ensure the data output met our expectations, and it provided a platform to verify the continuous data input process and the accuracy of the Celsius to Fahrenheit conversion. The subsequent image illustrates the console output during this phase.

![Figure9.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure9.png)

Figure 9: Successful Console Output 

Upon successfully formatting the data, our next objective was integrating the LCD display. Through our research, we identified two compatible libraries: LcdApi.py and pico_i2c_lcd.py. These libraries were especially attractive because they were freely available, compatible with our I2C TWI 1602 Serial LCD Module, and came with an additional testing script, pico_i2c_lcd_test.py. This script proved invaluable in troubleshooting, helping us determine whether the LCD had any functional issues or wiring discrepancies. After confirming the proper implementation of the LCD, we combined our previous data formatting work to project the temperature readings directly onto the display. The subsequent images depict the results from running pico_i2c_lcd_test.py and the formatted data displayed on the LCD.

![Figure10.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure10.png)

Figure 10: Successful LCD Display

Following our success with the LCD integration, we shifted our focus to the implementation of the DS18x20 sensor. As with previous tasks, we heavily relied on the sensor's datasheet, YouTube tutorials, and the MicroPython documentation. These resources guided us to employ the `ds18x20.py` and `onewire.py` libraries. Initially, we faced challenges in correctly capturing sensor data as an array. However, after delving deeper into the documentation and conducting thorough debugging, we successfully retrieved data from the sensor and displayed it on the LCD.Following the successful implementation of the sensor, we integrated the logic for our text message alert system. Predetermined bounds were set to trigger these alerts. When the temperature soared to 90°F or higher, a message stating, "The sensor has reached a temperature of 90°F or more" would be dispatched. Conversely, if the temperature dipped to 70°F or below, the alert read, "The sensor has dropped to a temperature of 70°F or less."

![Figure11.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure11.png)

Figure 11: Successful Mobile Alert 

Our next significant undertaking was the establishment of the server-client network. To relay the sensor data from the Pico W to our front-end web application, we leaned on the principles of the three-layer IoT system architecture. This necessitated the integration of a network component to seamlessly connect the perception layer to the application layer.
On the Pico W, we developed a function designed to publish messages to an MQTT broker, specifically utilizing HiveMQ Cloud for this project. We employed the `umqtt` library which provided us with the `robust.py` and `simple.py` scripts. These facilitated the publishing of data to the "Temperature" topic, representing the temperature readings sourced from the DS18x20 at intervals of one second.

To further process and present these readings, we initiated a server using Node.js, leveraging the Express framework. This server was initially configured to solely subscribe to the broker.Following the establishment of the server-client network, we moved to integrating the logic that allows control over the display from the button or the web interface. A vital consideration during this phase was to ensure that data was only transmitted to the server when the LCD was activated. This was adeptly achieved using logic statements combined with boolean variables.

Our concluding tasks revolved around relaying alerts to the front end. If the sensor became detached, an error message would be dispatched and displayed within the front-end interface. Similarly, if power to the device was entirely interrupted, another distinct message would be transmitted and showcased on the front end. For a clearer understanding of the progression and tasks undertaken in the backend section, refer to the table below.

![Table4.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Table4.png)

### Frontend
To construct the web application for this project, Visual Studio Code IDE was employed, utilizing JavaScript as the primary programming language. The application is built on a React framework, integrating a graphing tool from ApexCharts, a data visualization JavaScript library. ApexCharts was chosen for its user-friendly interface and its graphing tools, such as a real-time graphing skeleton and a toolbar with zoom-in and zoom-out features.

The development process began with the initialization of the data stream as a state variable with a single point, serving as the starting point before any graphing happens. The appendData function plays a crucial role in adding new data points to the data stream and managing the data when the conversion button is activated. A useEffect hook is meticulously implemented to ensure the graph is updated in real-time whenever there is a modification in the data stream, be it through data conversion or the addition of a new data point.
The conversion between Celsius and Fahrenheit is executed on the front-end. The application uses React Hooks, such as useState, useEffect, and useRef, to manage states and perform side effects in response to user interactions. The state variable isCelsius is initialized as true through a useState hook, reflecting that the initial temperature data is received in Celsius.

The application displays the most recent temperature at the top in large font, utilizing the state variable initialized to null to hold the latest temperature data, lastTemperature. A useEffect hook, coupled with a socket.io connection, is implemented to listen for incoming temperature data and update the lastTemperature state variable accordingly. The application is designed to dynamically render the display based on various states, showing either the last known temperature, "Unplugged Sensor", or "No data available", depending on the connectivity and power status of the sensor.

Several interactive buttons are integrated into the application, each serving a distinct purpose. The data stream toggle button allows users to pause and resume the data stream, preventing the graphing of incoming data when paused. The temperature unit toggle button enables users to switch between Celsius and Fahrenheit, invoking the appendData function to convert the units when toggled. Lastly, a display toggle button is incorporated to control the visibility of the LCD display virtually.
When buttons that necessitate sending commands back to the Pico W are activated, a seamless communication channel is established. The Pico W subscribes to a specific topic that the server publishes, receiving commands sent from the front-end through HTTP POST requests. For instance, toggling the LCD display sends an HTTP POST request to the server, which then publishes to a topic, “lcd/commands”, that the Pico W is subscribed to. The Pico W interprets the received message and executes the corresponding command, ensuring a harmonious interaction between the front-end, the server, and the Pico W.

## Roads Not Taken
Originally, we considered utilizing the ESP8266 as our combined sensor and microcontroller. However, as we began designing web components, it became evident that a device with enhanced Wi-Fi capabilities was essential to efficiently publish data. We considered using a Raspberry Pi 4, but the price and accessibility to get one pushed us to explore other options. Consequently, we opted for the Raspberry Pi Pico W. 

For front-end, we were initially thinking about using Grafana and InfluxDB. We decided not to go this route because Sirena had more experience with other technologies and was not finding many resources for embedded a Grafana graph to a website and in real time.

## Test Report

![Table5.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Table5.png)

## Project Retrospective

Our project, aimed at designing a web-enabled thermometer device, was a journey marked by learning, experimentation, and iterative development. The project, while ambitious, was successful, with the integration of various components and technologies to create a cohesive and functional system. However, it was still challenging and had areas for improvement.

The effectiveness of our choices in the design process was positive. The selection of the Raspberry Pi Pico W and the integration of various libraries and technologies allowed us to establish a robust backend and a user-friendly frontend. The utilization of MicroPython, the integration of the DS18x20 sensor, and the establishment of the server-client network using HiveMQ Cloud were pivotal in achieving the project's objectives. However, the project did fall short of meeting some of the front-end requirements fully. One reason that our project fell short was by not fully meeting the front-end requirements. The display corresponding to the states of the third box was incomplete, and the display would not clear even after no new data was coming in. In the future, we will spend more time working through the smaller details and getting the basics to work well before implementing the more complex requirements. 

Our team operated smoothly, as we kept communications open with each other. Each member leveraged their strengths to contribute significantly to the project. Diego was instrumental in handling the hardware components and the physical housing of the project, ensuring the stability and reliability of the physical aspects of our device. His meticulous attention to hardware integration was crucial in establishing a solid foundation for the project.

Fatima played a pivotal role in backend development, focusing on serial communications, the text messaging feature by using Twilio, and LCD communication. Her expertise in these areas ensured seamless data transmission, effective user alerts, and clear data presentation on the LCD. Sirena collaborated with Fatima on backend aspects and led the frontend development. She was pivotal in establishing the broker on the Pico W and orchestrating the client-server interactions, ensuring smooth communication between the various components of the project.

The team maintained a balanced workload distribution, with each member dedicating substantial time and effort to their respective areas, and regular meetings were held to synchronize our progress and address any arising challenges. Our approach to project management was structured and disciplined, utilizing Asana for task tracking and management.  

![Figure12.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure12.png)

Figure 12: Asana tasks

![Figure13.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure13.png)

Figure 13: Asana Tasks

The agile methodology was our guiding principle, allowing for iterative development and continuous refinement of our strategies based on the evolving needs and challenges of the project.

![Figure14.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Figure14.png)

Figure 14: Gantt Chart

Appendix & References 
DS18B20 Digital Temperature Sensor and Thermal Watchdog Data Sheet. Retrieved from https://www.analog.com/media/en/technical-documentation/data-sheets/DS18B20.pdf 

Micropython. (n.d.). DS18x20 temperature sensor driver for MicroPython. Retrieved from https://github.com/micropython/micropython-lib/tree/master/micropython/drivers/sensor/ds18x20  

Micropython. (n.d.). Onewire bus driver for MicroPython. Retrieved from https://github.com/micropython/micropython-lib/tree/master/micropython/drivers/bus/onewire  

Micropython. (n.d.). Robust MQTT client implementation for MicroPython. Retrieved from https://github.com/micropython/micropythonlib/blob/master/micropython/umqtt.robust/umqtt/robust.py 

Micropython. (n.d.). Simple MQTT client implementation for MicroPython. Retrieved from https://github.com/micropython/micropythonlib/blob/master/micropython/umqtt.simple/umqtt/simple.py 

Micropython.org. (n.d.). Onewire driver for RP2 - Quick reference. Retrieved from https://docs.micropython.org/en/latest/rp2/quickref.html#onewire-driver  

Micropython.org. (n.d.). Onewire for ESP8266. Retrieved from https://docs.micropython.org/en/latest/esp8266/tutorial/onewire.html 

Pinout.xyz. (n.d.). Pico pinout. Retrieved from 
https://pico.pinout.xyz 

Raspberry Pi Foundation. (n.d.). Connecting to the internet with Pico W. Retrieved from https://datasheets.raspberrypi.com/picow/connecting-to-the-internet-with-pico-w.pdf?_gl=1*vpm2gr*_ga*ODg4MDQxMzQwLjE2OTYxOTgwNDA.*_ga_22FD70LWDS*MTY5NjE5ODAzOS4xLjEuMTY5NjE5ODA2Ny4wLjAuMA.. 

Raspberry Pi Foundation. (n.d.). Pico W datasheet. Retrieved from https://datasheets.raspberrypi.com/picow/pico-w-datasheet.pdf?_gl=1*1pxt7cb*_ga*ODg4MDQxMzQwLjE2OTYxOTgwNDA.*_ga_22FD70LWDS*MTY5NjE5ODAzOS4xLjEuMTY5NjE5ODA3Ny4wLjAuMA.. 

T-622. (n.d.). RPI-PICO-I2C-LCD. Retrieved from 
https://github.com/T-622/RPI-PICO-I2C-LCD/tree/main 

![Table6.png](https://github.com/fqkammona/Temperature-Sensor/blob/main/Lab-Images/Table6.png)


