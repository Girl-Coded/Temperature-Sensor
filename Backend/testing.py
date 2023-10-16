import machine
import onewire 
import ds18x20 
import time
from machine import I2C
from lcd_api import LcdApi
from pico_i2c_lcd import I2cLcd
import network
import urequests
from sms_internet import connect_to_internet, send_sms

I2C_ADDR     = 0x27
I2C_NUM_ROWS = 4
I2C_NUM_COLS = 20
 
 
i2c = I2C(0, sda=machine.Pin(0), scl=machine.Pin(1), freq=400000)
lcd = I2cLcd(i2c, I2C_ADDR, I2C_NUM_ROWS, I2C_NUM_COLS)
    
ds_pin = machine.Pin(17) 
ds = ds18x20.DS18X20(onewire.OneWire(ds_pin))
roms = ds.scan()[0]  # the one and only sensor
print('Found DS devices: ', roms)
degree = chr(223) # degree char
    
def main():
   ssid = ''
   password = ''
   recipient = '+'
   sender = '+'
   auth_token = ''
   account_sid = ''
   message = 'Sending from Pico'
   
   connect_to_internet(ssid, password)
   
   while True:
    ds.convert_temp()
    time.sleep_ms(750)
    for rom in roms:
        lcd.clear()
        temp_cel = ds.read_temp(roms)
        temp_fah = ds.get_fahrenheit(temp_cel)
        print("Temp: {}°C {}°F".format(round(temp_cel,2), round(temp_fah,2)))
        lcd.putstr("Temp: {}{}C".format((round(temp_cel,2)),degree))
        lcd.putstr("\nTemp: {}{}F ".format((round(temp_fah,2)),degree))
        if (temp_fah > 90):
            send_sms(recipient, sender, message, auth_token, account_sid)
        time.sleep(2)
    time.sleep(1)

if __name__ == "__main__":
    main()   
   

