var
        /* OPTIONS */
        BOUNDARY = 30, // {Number} Limit for character's position on corners
        MAX_ENEMIES = 5, // {Number} Max number of Aliens that will respawn at once
        PLAYER_SPEED = 6, // {Number} Speed in pixels which the player moves
        ENEMY_SPEED = 15, // {Number} Speed in pixels which the enemy moves 
        ENEMY_POINTS = 50, // {Number} Starting points worth for killing the Alien

        /* Components */
        screen, running, input, frames,
        /* Sprites */
        spriteAlien, spriteBoss, spritePlayer,
        /* Characters */
        player, graveyard, listAliens, listAliensBullets, listBullets,
        /* Enemies properties */
        speed, animate, respawn;


function main() {
    var _screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            _screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    screen = new Screen(_screenWidth * 0.97, _screenHeight);

    input = new InputHandeler();

    // Create all the sprites
    var sprites = new Image();
    sprites.addEventListener("load", function () {

        spriteAlien = [new Sprite(this, 0, 0, 22, 16), new Sprite(this, 0, 16, 22, 16)];
        spriteBoss = new Sprite(this, 22, 0, 48, 21);
        spritePlayer = new Sprite(this, 70, 0, 26, 16);

        // Start the game after sprites are loaded
        init();
        run();
    });
    sprites.src = "res/sprites.png";
}


/**
 * Prepare the game objects
 */
function init() {
    running = false;
    frames = 0;
    speed = 25;
    respawn = 150;

    // Creates the player positioned on the center bottom of screen
    player = new Player(spritePlayer, (screen.width - spritePlayer.w) / 2, screen.height - (BOUNDARY + spritePlayer.h), PLAYER_SPEED);

    // Prepares the needed lists
    listBullets = [];
    listAliens = [];
    listAliensBullets = [];
    graveyard = [];

    // Starts the game with one Alien spawned
    addAlien();
}


/**
 * Run the game updates and rendering inside a loop
 */
function run() {
    if (!running) {
        running = true;
        var loop = function () {
            update();
            render();

            window.requestAnimationFrame(loop, screen.canvas);
        };
        window.requestAnimationFrame(loop, screen.canvas);
    }
}


/**
 * Update the game logic
 */
function update() {
    frames++;

    updatePlayer();
    updateAliens();
    updateBullets();
}

/**
 * Update player
 * 
 * [CHALLENGE]
 * The spaceship should move only to the left and right and have borders as their limits.
 * [/CHALLENGE]
 */
function updatePlayer() {
    // Move player
    if (input.isDown(37)) { // Left key
        player.moveLeft();
    }
    if (input.isDown(39)) { // Right key
        player.moveRight();
    }

    // Limits player position
    player.x = Math.max(Math.min(player.x, screen.width - (BOUNDARY + player.sp.w)), BOUNDARY);

    // Pew pew pew
    if (input.isPressed(32)) { // Spacebar key
        listBullets.push(new Bullet(player.x + 10, player.y, -8, 2, 6, "#FFF"));
    }
}

/**
 * Update aliens
 */
function updateAliens() {
    // Alien's respawn
    if (frames % respawn === 0) {
        addAlien();
    }

    // Alien's animation frequency
    if (frames % speed === 0) {
        animate = !animate;
    }

    // Alien's movement    
    if (frames % speed === 0) {

        for (var i = 0, len = listAliens.length; i < len; i++) {
            var a = listAliens[i];
            a.x += ENEMY_SPEED * a.dir;

            var _min = screen.width, _max = 0;
            _max = Math.max(_max, a.x + a.w);
            _min = Math.min(_min, a.x);

            // Change Alien's direction and move down based on screen boundaries
            if (_max > screen.width - BOUNDARY || _min < BOUNDARY) {
                listAliens[i].dir *= -1;
                listAliens[i].x += ENEMY_SPEED * listAliens[i].dir;
                listAliens[i].y += ENEMY_SPEED;
            }
        }
    }

    // Aliens random shooting
    if (!animate && Math.random() < 0.1 && listAliens.length > 0) {
        var randomAlien = listAliens[Math.round(Math.random() * (listAliens.length - 1))];
        listAliensBullets.push(new Bullet(randomAlien.x + randomAlien.w * 0.5, randomAlien.y + randomAlien.h, 4, 2, 4, "#ff0000"));
    }
}

/**
 * Check bullet hit and position
 * 
 * [CHALLENGE]
 * The spaceship should be able to fire bullets. 
 * The bullets should go from the top of the spaceship to the top of the game screen if no enemies where shot.
 * [/CHALLENGE]
 */
function updateBullets() {
    // Player bullets
    for (var iB = 0, lenB = listBullets.length; iB < lenB; iB++) {
        var bullet = listBullets[iB];
        bullet.update();

        // Check if bullet goes outside screen
        if (bullet.y + bullet.height < 0 || bullet.y > screen.height) {
            listBullets.splice(iB, 1);
            iB--;
            lenB--;
            continue;
        }

        // Check if bullet hits Alien
        for (var iA = 0, lenA = listAliens.length; iA < lenA; iA++) {
            var alien = listAliens[iA];
            if (AABBCollision(bullet.x, bullet.y, bullet.width, bullet.height, alien.x, alien.y, alien.w, alien.h)) {
                graveyard.push(alien);
                listAliens.splice(iA, 1);
                iA--;
                lenA--;
                listBullets.splice(iB, 1);
                iB--;
                lenB--;
                player.score(alien.points);
            }
        }
    }

    // Alien bullets
    for (var iAB = 0, lenAB = listAliensBullets.length; iAB < lenAB; iAB++) {
        var bullet = listAliensBullets[iAB];
        bullet.update();

        // Check if bullet goes outside screen
        if (bullet.y + bullet.height < 0 || bullet.y > screen.height) {
            listAliensBullets.splice(iAB, 1);
            iAB--;
            lenAB--;
            continue;
        }

        // Check if bullet hits Player
        if (AABBCollision(bullet.x, bullet.y, bullet.width, bullet.height, player.x, player.y, player.sp.w, player.sp.h)) {
            init();
            break;
        }
    }
}

/**
 * Add aliens to the near top center of the screen 
 * 
 * [CHALLENGE]
 * The enemies should be randomly placed in the game screen.
 * Maximum of 5 enemies should be in the screen at the same time.
 * [/CHALLENGE]
 */
function addAlien() {
    if (listAliens.length < MAX_ENEMIES) {
        var _quarter = screen.width / 4;
        var _randomX = Math.floor(Math.random() * ((screen.width - _quarter) - _quarter + 1) + _quarter);
        var _randomY = Math.floor(Math.random() * (screen.height / 2 - BOUNDARY + 1) + BOUNDARY);

        listAliens.push(new Alien(spriteAlien, _randomX, _randomY, spriteAlien[0].w, spriteAlien[0].h, ENEMY_SPEED, ENEMY_POINTS));
    }
}


/**
 * Render the game state to the canvas
 */
function render() {
    screen.clear();

    // Draw score
    screen.ctx.font = "30px SpaceInvaders";
    screen.ctx.fillText("SCORE", BOUNDARY + 10, BOUNDARY + 30);
    screen.ctx.font = "25px SpaceInvaders";
    screen.ctx.fillText(player.points.pad(6), BOUNDARY + 10, BOUNDARY + 60);

    // Draw boundaries
    screen.ctx.fillStyle = "#333";
    screen.ctx.fillRect(BOUNDARY, BOUNDARY, 1, screen.height - BOUNDARY * 2);
    screen.ctx.fillRect(screen.width - BOUNDARY, BOUNDARY, 1, screen.height - BOUNDARY * 2);

    // Draw aliens
    for (var i = 0, len = listAliens.length; i < len; i++) {
        var alien = listAliens[i];
        screen.drawSprite(alien.sp[animate ? 1 : 0], alien.x, alien.y);
    }

    // Fade out dead aliens
    // 
    // [CHALLENGE] 
    // If a bullet hits a enemy, the enemy should fade away slowly from the game screen 
    // and as soon it fades out completely, a new one should appear in a random position
    // [/CHALLENGE]
    for (var i = 0, len = graveyard.length; i < len; i++) {
        var alien = graveyard[i];
        if (alien && alien.health > 0) {
            screen.ctx.save();
            screen.ctx.globalAlpha = alien.health;
            screen.drawSprite(alien.sp[0], alien.x, alien.y);
            screen.ctx.restore();
            graveyard[i].health -= 0.05;
        } else {
            graveyard.splice(i, 1);
            addAlien();
        }
    }

    // Draw bullets
    screen.ctx.save();
    for (var i = 0, len = listBullets.length; i < len; i++) {
        screen.drawBullet(listBullets[i]);
    }
    for (var i = 0, len = listAliensBullets.length; i < len; i++) {
        screen.drawBullet(listAliensBullets[i]);
    }
    screen.ctx.restore();

    // Draw player
    screen.drawSprite(player.sp, player.x, player.y);
}

/**
 * Update screen in case it is resized
 */
function updateScreen() {
    var _screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            _screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    screen.restart(_screenWidth * 0.97, _screenHeight);
    player.x = (screen.width - player.sp.w) / 2;
}
