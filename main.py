import network
import urequests
import time
from sms_internet import connect_to_internet, send_sms

def main():
   ssid = ''
   password = ''
   recipient = ''
   sender = ''
   auth_token = ''
   account_sid = ''
   message = 'Sending from Pico'
   
   connect_to_internet(ssid, password)
   # Send the SMS
   send_sms(recipient, sender, message, auth_token, account_sid)

if __name__ == "__main__":
    main()
