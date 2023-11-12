import network
import socket
import urequests as requests
from time import sleep, localtime
from picozero import pico_temp_sensor, pico_led
from config import ssid, hostname, endpoint, remote, password
import machine
import ujson
import ntptime
from isodate import to_iso_date

#ssid = 'Mobiiliperuna'
#hostname = "rpicow-temp-1"
#remote = "temp.iot.not.rip"
#password = 'aoe142536'

def connect():
    #Connect to WLAN
    wlan = network.WLAN(network.STA_IF)
    wlan.config(hostname=hostname)
    wlan.active(True)
    wlan.connect(ssid, password)
    while wlan.isconnected() == False:
        print('Waiting for connection...')
        sleep(1)
    ip = wlan.ifconfig()[0]
    print(f'Connected on {ip}')
    return ip

def open_socket(ip):
    # Open a socket
    address = (ip, 8080)
    connection = socket.socket()
    connection.bind(address)
    connection.listen(1)
    print(connection)
    return connection

def post_temp():
    temperature = 0
    pico_led.off()
    payload = {
        "device": hostname,
        "data": {
            "temp": temperature
            }
        }
    while True:
        pico_led.off()
        temperature = pico_temp_sensor.temp
        payload["data"]["temp"]=temperature
        payload["time"] = to_iso_date(localtime())
        post_data = ujson.dumps(payload)
        response = requests.post("{}/{}".format(remote, endpoint), headers = {'content-type': 'application/json'}, data=post_data)
        response.close()
        pico_led.on()
        sleep(1)
        pico_led.off()
        sleep(9)

def serve(connection):
    state = 'OFF'
    pico_led.off()
    temperature = 0
    while True:
        client = connection.accept()[0]
        pico_led.on()
        while True:
            temperature = pico_temp_sensor.temp
            temp_str = "Temperature: {} °C\n".format(temperature)
            client.send(temp_str)
            sleep(1)
        client.close()

try:
    ip = connect()
    ntptime.settime()
    post_temp()
except KeyboardInterrupt:
    machine.reset()

try:
    ip = connect()
except KeyboardInterrupt:
    machine.reset()