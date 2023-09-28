import machine
from machine import Pin
import constants
import environment
import onewire 
import ds18x20 
import time
from machine import I2C
from lcd_api import LcdApi
from pico_i2c_lcd import I2cLcd
import network
import urequests
from sms_internet import connect_to_internet, send_sms
from umqtt.simple import MQTTClient

I2C_ADDR     = 0x27
I2C_NUM_ROWS = 4
I2C_NUM_COLS = 20

i2c = I2C(0, sda=machine.Pin(0), scl=machine.Pin(1), freq=400000)
lcd = I2cLcd(i2c, I2C_ADDR, I2C_NUM_ROWS, I2C_NUM_COLS)
lcd.backlight_off()
button = Pin(14, Pin.IN, Pin.PULL_UP)

ds_pin = machine.Pin(17) 
ds = ds18x20.DS18X20(onewire.OneWire(ds_pin))
roms = ds.scan()[0]  # the one and only sensor
print('Found DS devices: ', roms)
degree = chr(223) # degree char

def connect_wifi():
    ssid = environment.SSID
    password = environment.PASSWORD
    connect_to_internet(ssid, password)

def connectMQTT():
    try:
        client = MQTTClient(
            client_id=b"girl-coded12",
            server=constants.SERVER_HOSTNAME,
            port=8883,
            user=constants.team14,
            password=constants.GirlCoded12,
            keepalive=7200,
            ssl=True,
            ssl_params={'server_hostname': constants.SERVER_HOSTNAME}
        )
        client.set_callback(sub_cb)
        client.connect()
        client.subscribe(b"lcd/command")
        return client
    except Exception as e:
        print("Error connecting or subscribing to MQTT: ", str(e))
        return None

def sub_cb(topic, msg):
    print("SUB")
    if topic == b'lcd/command':
        if msg == b'off':
            print("HERE")
            lcd.backlight_off()
            lcd.display_off()
        elif msg == b'on':
            print("ON")
            lcd.backlight_on()
            lcd.display_on()

def publish(client, topic, value):
    try:
        client.publish(topic, value)
        print("Publish Done")
    except Exception as e:
        print("Error publishing to MQTT: ", str(e))
        
message_sent = False 
def main():
    client = connectMQTT()  # Connect to MQTT
    if client is None:  # Check if client is successfully connected
        print("Failed to initialize MQTT client.")
        return

    while True:
        ds.convert_temp()
        time.sleep_ms(750)
        for rom in roms:
            lcd.clear()
            temp_cel = ds.read_temp(roms)
            temp_fah = ds.get_fahrenheit(temp_cel)
            print("Temp: {}°C {}°F".format(round(temp_cel,2), round(temp_fah,2)))
            
            if button.value() == 0:
                lcd.backlight_on()
                lcd.display_on()
                lcd.putstr("Temp: {}{}C".format((round(temp_cel,2)),degree))
                lcd.putstr("\nTemp: {}{}F ".format((round(temp_fah,2)),degree))
            else:
                lcd.backlight_off()
                lcd.display_off()
            
            publish(client, "Temp", str(temp_cel))
            
            if temp_fah > 90 and not message_sent:
                recipient = environment.RECIPIENT
                sender = environment.SENDER
                auth_token = environment.AUTH_TOKEN
                account_sid = environment.ACCOUNT_SID
                message = 'Sending from Pico'
                send_sms(recipient, sender, message, auth_token, account_sid)
                message_sent = True
            elif temp_fah < 90:
                message_sent = False
            
            try:
                client.check_msg()
            except Exception as e:
                print("Error checking MQTT messages: ", str(e))
            time.sleep(2)

if __name__ == "__main__":
    main()
