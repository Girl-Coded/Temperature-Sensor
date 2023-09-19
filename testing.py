import machine
import onewire 
import ds18x20 
import time 
 
ds_pin = machine.Pin(17) 
ds = ds18x20.DS18X20(onewire.OneWire(ds_pin))
roms = ds.scan()[0]  # the one and only sensor
print('Found DS devices: ', roms)
ds.convert_temp()
time.sleep_ms(750)
temp_cel = ds.read_temp(roms)
temp_fah = ds.get_fahrenheit(temp_cel)
print("Temp: {}°C {}°F".format(temp_cel,temp_fah)) 
