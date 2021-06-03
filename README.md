# SCIOTProject

# Fish Tank Manager
![image](https://user-images.githubusercontent.com/55912466/120684174-ad854000-c49e-11eb-8771-991297893ec6.png)

This is a project for Sciot exam. 
The goal of this project is that to simulate a sensor  for a fish tank in order to check ph of it. It sends a message on a topic on RabbitMQ and two functions in Nuclio that send and receive message. The idea behind this project is to simulate a sensor that checks ph of the water in order to change it when it is too low or too high. The change takes place by sending a message to a bot telegram and through the bot commands the pH is modified, where the command simulate the action ("Decrease the ph").

# Summary

+ Introduction: a brief introduction about the project
+ Architecture: architecture of the project
+ Structure: structure of the project
+ How to install and run it: a brief guide about installation and run

# Introduction
Fishtank manager consists of a <code> pH sensor</code> that simulate the check of pH's water and if the value is too low or too high, notified this at user and the user can choose:
+ Adjust pH manually
+ Adjust pH automatically
+ Look for someone in the family for adjusting pH

# Architecture
The main goal of the project is to check the pH of the water, and due to I don't have any pH sensor, you can do this in two ways:
+ using the **mqttsendpH** of Nuclio
+ using **MQTT Client (Android App)** by smartphone

The ideal value of pH is between **6.5 and 8.5** but you can publish a value on the queue **iot/sensors/state** , but if the value is greater than the range or less than the range, you'll receive a notification on telegram to adjust the value. When a value is published on the queue, a function **mqttconsumepH** on Nuclio is triggered and check the value: if pH<=6.5 (too low) or pH>=8.5 (too high), publish a message on the queue **iot/alerts**, and at this point the message is intercepted inside the **bot.js** and a notification is sent to the user with the **Telegram Bot**.
Now, the user can choose between the previous three actions, to adjust the ph.

# How to install and run it
> Pay attention: FishTank Manager requires **Docker and NodeJS**
Now, I'll guide you within the different phases of the installation
First of all open two different terminal, (Windows Powershell for example)
+ Docker Nuclio run:

<pre>docker run -p 8070:8070 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp:/tmp nuclio/dashboard:stable-amd64</pre>
+ Dcoker RabbitMQ run:
 
<pre>docker run -p 9000:15672  -p 1883:1883 -p 5672:5672  cyrilix/rabbitmq-mqtt</pre>


In your browser search **localhost:8070** to check Nuclio installation and **localhost:9000** to check RabbitMQ installation.
+ Now, from the Nuclio homepage, create a new project and call it *FishTank* or something else
+ After this, press *Create function *, *Import* and from **yamlFolder** import the two functions
+ **Important**: in both the functions change the IP address with your IP, you'll find (*Put your IP here*) and from consumer function, go on trigger windows and change the IP again. 
+ Deploy both functions, **Deploy button** 
+ Now both functions are running!

+ Create *Telegram Bot*
+ Go on telegram, search **BotFather**
+ Press *start* and */newBot* command
+ Give it a name, and unique ID
+ Now, copy the bot token and paste it on **Bot.js**, you'll find const bot 
+ In the same .js, insert your IP address, you'll find *INSERT YOUR IP HERE*

+ Installation phase and dependencies
+ Open a terminal and write 
  + npm install
  + node src/bot.js

+ Start Telegram Bot for the interaction
Go on telegram and start your bot, don't stop it if you want updates about pH's water, and enjoy it!

If all the steps were correct, now you're able to send a random pH value from Nuclio dashboard with **mqttrandompH** function and the test button or with the android or IoS app with your smartphone. How I said previous, if the value is greater than **8.5** or less than **6.5** the bot will send you a notification and you can choose what to do.
