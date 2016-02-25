

[![Join the chat at https://gitter.im/FH-Potsdam/connecting-bits](https://badges.gitter.im/FH-Potsdam/connecting-bits.svg)](https://gitter.im/FH-Potsdam/connecting-bits?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![ZenHub] (https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)] (https://zenhub.io) [![Managed with asana](https://raw.githubusercontent.com/FH-Potsdam/connecting-bits/master/documentation/asanabadge.jpg)](https://app.asana.com/-/share?s=80136391129690-GUJvZiI4OufoWMTDhjjkZauXYEhwvhpqUgnTvw22tMr-74348281972886)
[![Javascript documentation](http://fh-potsdam.github.io/connecting-bits/badge.svg?build=123)](http://fh-potsdam.github.io/connecting-bits/source.html)

# TRANSL8R - Play the _Chinese whispers_ game with machines

## The project.
TRANSL8R is a chain of multilingual machines to play the _Chinese whispers_ game with, made for exhibitions.
It consists of four boxes. The first box listens to the visitor's message and then repeats it out loud. The second box listens to the first one and translates that message into a different language. The third and fourth one each do the same (every box speaks a different language). Finally, the first box translates the message back into the original language. In an ideal case, that message would be the same as the original one, but the little mistakes of the translation engine make for a funny ending, just as in the _Chinese whispers_ game.

## The boxes.
The four boxes are custom-made cubic machines with various mechanical elements and electronics.

### Tech specs
Each box consists of:

- **An LED:** To indicate that the box is speaking
- **Two servo motors:** To move the box as it listens and speaks and to give it a living character
- **An infrared sensor:** To detect the presence of someone standing in front of it and start the audio recording
- **A microphone:** To record the person's voice
- **A speaker:** To… you know… speak…
- **A particle photon board:** To control all this and be controlled over Wi-Fi

We also used:
- **A Mac mini**: to record, translate and play the translations

### Design
The base is made of concrete and looks like a thick frame. On top of it there is a structure of medium-density-fibreboard that holds everything together: the photon board, the microphone and the LED, as well as both servo motors with their respective lifting and tilting movements. As a cover, we bent a thin aluminium plate to create a five-sided cube.
The four boxes are on top of a custom-made, black table, in which we hid the infrared sensor, the speakers, the Mac mini and all the cables.

## How it works
In reality, the boxes don't really "listen" to each other as with a microphone; everything is done at once by a computer and played simultaneously with the movement of the boxes.

## The makers.
We are students from the [University of Applied Sciences of Potsdam](http://fh-potsdam.de) \[aka] @fh-potsdam. Our team consists of interface, product, and graphic designers that took part in the course [“Input Output - Introduction to process-oriented design”]( https://fhp.incom.org/workspace/6176) by [Fabian Morón Zirfas]( https://github.com/fabiantheblind). This project was developed during the last third of the course. To see the other projects we made, visit [this repository](https://interface.fh-potsdam.de/eingabe-ausgabe/2015-2016/).

## The process.

### The base reference
Coming soon

#### Initial ideas
Coming soon

#### Our final choice
Coming soon

### Organisation
Coming soon
