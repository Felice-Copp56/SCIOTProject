# SCIOTProject

# Fish Tank Manager

This is a project for Sciot exam. 
The goal of this project is that to simulate a sensor  for a fish tank in order to check ph of it. It sends a message on a topic on RabbitMQ and two functions in Nuclio that send and receive message. The idea behind this project is to simulate a sensor that checks ph of the water in order to change it when it is too low or too high. The change takes place by sending a message to a bot telegram and through the bot commands the pH is modified, where the command simulate the action ("Decrease the ph").

