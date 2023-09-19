import machine
import onewire 
import ds18x20 
import time 
 
ds_pin = machine.Pin(17) 
ds = ds18x20.DS18X20(onewire.OneWire(ds_pin))
roms = ds.scan()[0]  # the one and only sensor
print('Found DS devices: ', roms)
degree = chr(223) # degree char

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
        time.sleep(2)
    time.sleep(1)
