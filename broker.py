#Native libs
import network
import time
from time import sleep

#Third Party
from umqtt.simple import MQTTClient


# Internal libs
import constants
def connectMQTT():
    #Connects to Broker
    client = MQTTClient(
        hostname = 230166eb60024a72b256ff9f4b53fbe9
        client_id=b"girl-coded",
        server=constants.hostname,
        port=8883,
        user=constants.team14,
        password=constants.GirlCoded12,
        keepalive=7200,
        ssl=True,
        ssl_params={'server_hostname': constants.hostname}
    )
    client.connect()
    return client

#set pins of pico and sensor to whatever is below
# Connect to internet and set MPU to start taking readings
#i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)
#imu = MPU6050(i2c)
client = connectMQTT()
def publish(topic, value):
    #Sends data to the broker'''
    print(topic)
    print(value)
    client.publish(topic, value)
    print("Publish Done")


#figure out how to pull data from pico sensor
while True:
    #tem = round(imu.temperature, 3)
    #Publish to broker
    #publish('picow/tem', str(tem))
    #print("Temperature", tem, "        ", end="\r")
    sleep(1)