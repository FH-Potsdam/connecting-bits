
[![Join the chat at https://gitter.im/FH-Potsdam/connecting-bits](https://badges.gitter.im/FH-Potsdam/connecting-bits.svg)](https://gitter.im/FH-Potsdam/connecting-bits?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![ZenHub] (https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)] (https://zenhub.io) [![Managed with asana](https://raw.githubusercontent.com/FH-Potsdam/connecting-bits/master/documentation/asanabadge.jpg)](https://app.asana.com/-/share?s=80136391129690-GUJvZiI4OufoWMTDhjjkZauXYEhwvhpqUgnTvw22tMr-74348281972886)
[![Javascript documentation](http://fh-potsdam.github.io/connecting-bits/badge.svg?build=123)](http://fh-potsdam.github.io/connecting-bits/source.html)

# TRANSL8R - Play the _Chinese whispers_ game with machines

(Video)

## The project.
TRANSL8R is a chain of multilingual machines to play the _Chinese whispers_ game with, made for exhibitions.
It consists of four boxes. The first box listens to the visitor's message and then repeats it out loud. The second box listens to the first one and translates that message into a different language. The third and fourth one each do the same (every box speaks a different language). Finally, the first box translates the message back into the original language. In an ideal case, that message would be the same as the original one, but the little mistakes of the translation engine make for a funny ending, just as in the _Chinese whispers_ game.

## The boxes.
The four boxes are custom-made cubic machines with various mechanical elements and electronics.

### Tech specs
![arduino and sensors](images/hardware-.3.jpg)

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
![final design](images/hardware-.4.jpg)


The base is made of concrete and looks like a thick frame. On top of it there is a structure of medium-density-fibreboard that holds everything together: the photon board, the microphone and the LED, as well as both servo motors with their respective lifting and tilting movements. As a cover, we bent a thin aluminium plate to create a five-sided cube.
The four boxes are on top of a custom-made, black table, in which we hid the infrared sensor, the speakers, the Mac mini and all the cables.


![arduino and sensors](images/hardware-.1.jpg)

### How it works
In reality, the boxes don't really "listen" to each other as with a microphone; everything is done at once by a computer and played simultaneously with the movement of the boxes. This is what really happens:

0. The IR sensor is placed under the first box. As soon as someone gets closer than 30cm to the table, the next step is triggered.
1. The servo motors lift and tilt the first box.
2. A welcoming messaged is played back by the speaker, asking the visitor to say something.
3. The microphone records the visitor's message.
4. The first box tilts back, as it is about to say something. At the same time, the second box lifts and tilts, as if it were about to "listen" to its sibling.
5. The speaker plays back the visitor's message back (German). Under the hood, the computer is translating it into the three remaining languages and back.
6. The second box tilts back and the speaker plays back the translation (Spanish). The first box moves back to its original position, while the third box is already in "listening" mode.
7. Now the third box tilts back and the speaker plays back the translation (English). The second box moves back to its original position, while the fourth box is in "listening" mode.
8. The fourth box tilts back and the speaker plays back the translation (Arabic). The third box moves back to its original position, while the first box is in "listening" mode.
9. Finally, the first box tilts back and the speaker plays back the last translation (German). The fourth box moves back to its original position.
10. The first box moves back, too, and the next visitor can come.


## The makers.
![group work](images/group-work-.3.jpg)
We are students from the [University of Applied Sciences of Potsdam](http://fh-potsdam.de) \[aka] @fh-potsdam. Our team consists of interface, product, and graphic designers that took part in the course [“Input Output - Introduction to process-oriented design”]( https://fhp.incom.org/workspace/6176) by [Fabian Morón Zirfas]( https://github.com/fabiantheblind). This project was developed during the last third of the course. To see the other projects we made, visit [this repository](https://interface.fh-potsdam.de/eingabe-ausgabe/2015-2016/).


## The process.

### The base reference
This was our third and last project of the semester. Our assignment was to develop and build a modular system consisting of four different modules. Each module should have a Particle photon board with an Internet connection as well as sensors that would trigger something, like a temperature sensor that would make an LED blink once a certain temperature was reached, for instance. Such an activated module would then send a signal to the next one, which would do something as well, and send a signal to the next one until all four had successfully done 'something'.
Four groups were formed, each tasked with the creation of one unique module. And that was it. We had to figure out the rest for ourselves.

#### Initial ideas
![brainstorming](images/group-work-.1.jpg)

After hours of brainstorming, we came up with several ideas. Here are some of the more funny and original ones:
- **The four temperaments:** "A proto-psychological theory that suggests that there are four fundamental personality types, sanguine (optimistic and social), choleric (short-tempered or irritable), melancholic (analytical and quiet), and phlegmatic (relaxed and peaceful)." (Wikipedia) Using these personality types, we wanted to question whether it is possible to create machines with a certain temperament.
- **Black boxes:** The idea was to create a kind of treasure hunt with the help of at least twenty black boxes that looked the same. The visitors would have to find the 'real' four boxes, which would give leads as where to find the treasure.
- **Moralizer:** A judging robot that would scream whenever someone did something immoral, like lighting a cigarette.
- **TRANSL8R:** Four boxes that play the Chinese Whispers game (sound familiar?!) translating a message into several languages and back.

#### Our final choice
We ended up choosing the latter. This led us to restructure the groups, as we needed a consistent design and the same programming for all boxes.
Two new groups were formed: _Product design & Mechanics_ and _Hardware & Software_.


### Product design & Mechanics
Early on, the team developed a simple lifting and tilting system.
![mechanics](images/mechanics-.1.jpg)
![mechanics](images/mechanics-.2.jpg)
Copper and concrete were chosen as the external materials as both share an interesting texture and have colours that complement each other well.

![copper and concrete](images/product-design-.8.jpg)
Unfortunately, we realised that copper was heavier than expected, which meant we would need more powerful and considerably costlier servo motors to lift the copper cover. That was not an option, so the lighter (and cheaper!) aluminium it was.

![cutting the aluminium](images/product-design-.5.jpg)
_Cutting the aluminium_

![glueing the aluminium together](images/product-design-.7.jpg)
_Glueing the aluminium together._

![concrete](images/product-design-.6.jpg)
_The concrete in the custom-built molds_

![Building the first prototype](images/product-design-.2.jpg)
_Building the first prototype_

![Building the first prototype](images/product-design-.3.jpg)
![Laser-cutting the structure parts](images/product-design-.4.jpg)
_Laser-cutting the structure parts (medium-density-fibreboard)_

![finishing the table](images/product-design-.10.jpg)
_Finishing the table_


### Hardware & Software
![the coding team](images/software.jpg)
Check out the detailed documentation of the software team.
