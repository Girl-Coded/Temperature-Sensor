#Native libs
import network
import time
from time import sleep
from machine import Pin
import onewire
import ds18x20


#Third Party
from umqtt.simple import MQTTClient

# Connect to the DS18B20 temperature sensor
ds_pin = Pin(4) # Pin where the DS18B20 sensor is connected (adjust this pin as needed)
ds_sensor = ds18x20.DS18X20(onewire.OneWire(ds_pin))
                            
# Internal libs
import constants
def connectMQTT():
    #Connects to Broker
    client = MQTTClient(
        hostname = "230166eb60024a72b256ff9f4b53fbe9.s1.eu.hivemq.cloud"
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


client = connectMQTT()
def publish(topic, value):
    #Sends data to the broker'''
    print(topic)
    print(value)
    client.publish(topic, value)
    print("Publish Done")


#figure out how to pull data from pico sensor
while True:
    # Read temperature from DS18B20 sensor
    roms = ds_sensor.scan()
    ds_sensor.convert_temp()
    for rom in roms:
        temperature = ds_sensor.read_temp(rom)
        publish('picow/temperature', str(round(temperature, 3)))
        print("Temperature:", round(temperature, 3), "°C")
    
    sleep(1)
