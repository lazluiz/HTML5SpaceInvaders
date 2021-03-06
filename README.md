<p><img src="https://github.com/lazluiz/HTML5SpaceInvaders/blob/master/SpaceInvaders.png" align="right" height"200px" width="200px" / </p>
  
# HTML5 SpaceInvaders
>Space Invaders-like game developed in HTML5 and Javascript.

This game was developed with HTML5 and canvas, using Javascript as the language to manipulate the canvas and game logic.
It's quite simple, you control a tank/ship which fires bullets/lasers to protect yourself from Aliens and Bosses - whose also fires lasers. If they hit you, you die and the game restarts. The main objective is to kill those Aliens and make the highest score.

## Commands
**[Left Arrow]** - Moves to the left.

**[Right Arrow]** - Moves to the right.

**[Space Bar]** - Shoot.

## Game
- Shoot the Aliens which are worth 50 points; 
- Aliens respawn every 500 frames and also when you kill one Alien and it fades away;
- Every 750 points a Boss appears, which is worth 400 points;
- If the enemy hits you with it's bullets then the game resets;
- Your best score will be applied to the browser's local storage.

## Extra
- All the values - constant variables - might be changed in the **game.js** file;
- The game has a responsive layout, which adapts when you resize your browser.

## Code
The game logic consists of 6 files:

**helpers.js** has some helping classes and functions which may work for any other 2D game.

**game.js** contains the most of the game's logic, such as global variables, sprites, rendering and the updates/functions which are read in a infinite loop function;

**Alien.js** is the Alien class, containing it's properties, used for both Aliens and Bosses;

**Bullet.js** is the Bullet class, containing it's properties and a update function, used for everyone that shoots;

**Player.js** is the Player class, containing it's properties and score, moveLeft and moveRight functions;

**sprites.png** contains the Alien/Boss/Player sprites to be rendered.

