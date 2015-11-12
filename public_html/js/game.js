var
        /* OPTIONS */
        BOUNDARY = 30, // {Number} Limit for character's position on corners
        MAX_ENEMIES = 5, // {Number} Max number of Aliens that will respawn at once
        PLAYER_SPEED = 6, // {Number} Speed in pixels which the player moves
        ENEMY_SPEED = 15, // {Number} How frequent will the enemy move
        ENEMY_POINTS = 50, // {Number} Starting points worth for killing the Alien, Boss worth 8x
        BOSS_TRIGGER = 750, // {Number} Quantity of points the player have to make to spawn boss

        /* Components */
        display, input, frames,
        /* Sprites */
        spriteAlien, spriteBoss, spritePlayer,
        /* Characters */
        player, graveyard, listAliens, listAliensBullets, listBullets, boss,
        /* Enemies properties */
        speed, animate, respawn,
        
        /* CONSTANTS */
        STORAGE_BEST_SCORE = "best_score";


function main() {
    var _displayWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            _displayHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    display = new Screen(_displayWidth * 0.97, _displayHeight);

    input = new InputHandeler();

    // Create all the sprites
    var sprites = new Image();
    sprites.addEventListener("load", function () {

        spriteAlien = [new Sprite(this, 0, 0, 22, 16), new Sprite(this, 0, 16, 22, 16)];
        spriteBoss = [new Sprite(this, 22, 0, 48, 21)];
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
    frames = 0;
    respawn = 500;

    // Creates the player positioned on the center bottom of display
    player = new Player(spritePlayer, (display.width - spritePlayer.w) / 2, display.height - (BOUNDARY + spritePlayer.h), PLAYER_SPEED);

    // Prepares the needed lists
    listBullets = [];
    listAliens = [];
    listAliensBullets = [];
    graveyard = [];
    boss = null;

    // Starts the game with one Alien spawned
    addAlien();
}


/**
 * Run the game updates and rendering inside a loop
 */
function run() {
    var loop = function () {
        update();
        render();

        window.requestAnimationFrame(loop, display.canvas);
    };
    window.requestAnimationFrame(loop, display.canvas);
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
    player.x = Math.max(Math.min(player.x, display.width - (BOUNDARY + player.sp.w)), BOUNDARY);

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

    // Boss respawn
    if (player.points >= BOSS_TRIGGER && player.points % BOSS_TRIGGER === 0) {
        addBoss();
    }

    // Alien's animation frequency
    if (frames % ENEMY_SPEED === 0) {
        animate = !animate;
    }

    // Alien's movement    
    if (frames % ENEMY_SPEED === 0) {

        for (var i = 0, len = listAliens.length; i < len; i++) {
            var a = listAliens[i];
            a.x += BOUNDARY * a.dir;

            var _min = display.width, _max = 0;
            _max = Math.max(_max, a.x + a.w);
            _min = Math.min(_min, a.x);

            // Change Alien's direction and move down based on display boundaries
            if (_max > display.width - BOUNDARY || _min < BOUNDARY) {
                listAliens[i].dir *= -1;
                listAliens[i].x += BOUNDARY * listAliens[i].dir;
                listAliens[i].y += BOUNDARY;
            }
        }
    }

    // Boss movement
    if (boss) {
        var _bossStep = BOUNDARY / 5;
        boss.x += _bossStep * boss.dir;

        var _min = display.width, _max = 0;
        _max = Math.max(_max, boss.x + boss.w);
        _min = Math.min(_min, boss.x);

        // Change Boss's direction based on display boundaries
        if (_max > display.width - BOUNDARY || _min < BOUNDARY) {
            boss.dir *= -1;
            boss.x += _bossStep * boss.dir;
        }
    }

    // Aliens random shooting
    if (!animate && Math.random() < 0.025 && listAliens.length > 0) {
        var randomAlien = listAliens[Math.round(Math.random() * (listAliens.length - 1))];
        listAliensBullets.push(new Bullet(randomAlien.x + randomAlien.w * 0.5, randomAlien.y + randomAlien.h, 4, 2, 3, "#ffcccc"));
    }

    // Boss random shooting
    if (boss && Math.random() < 0.025) {
        listAliensBullets.push(new Bullet(boss.x + boss.w * 0.5, boss.y + boss.h, 6, 3, 6, "#ff0000"))
    }
}

/**
 * Check bullet hit and position
 * 
 * [CHALLENGE]
 * The spaceship should be able to fire bullets. 
 * The bullets should go from the top of the spaceship to the top of the game display if no enemies where shot.
 * [/CHALLENGE]
 */
function updateBullets() {
    // Player bullets
    for (var iB = 0, lenB = listBullets.length; iB < lenB; iB++) {
        var bullet = listBullets[iB];
        bullet.update();

        // Check if bullet goes outside display
        if (bullet.y + bullet.height < 0 || bullet.y > display.height) {
            listBullets.splice(iB, 1);
            iB--;
            lenB--;
            continue;
        }

        // Check if bullet hits Alien
        for (var iA = 0, lenA = listAliens.length; iA < lenA; iA++) {
            var alien = listAliens[iA];
            if (AABBCollision(bullet.x, bullet.y, bullet.width, bullet.height, alien.x, alien.y, alien.w, alien.h)) {
                player.score(alien.points);
                graveyard.push(alien);
                listAliens.splice(iA, 1);
                iA--;
                lenA--;
                listBullets.splice(iB, 1);
                iB--;
                lenB--;
            }
        }

        // Check if bullet hits Boss
        if (boss && AABBCollision(bullet.x, bullet.y, bullet.width, bullet.height, boss.x, boss.y, boss.w, boss.h)) {
            player.score(boss.points);
            graveyard.push(boss);
            boss = null;
        }
    }

    // Alien bullets
    for (var iAB = 0, lenAB = listAliensBullets.length; iAB < lenAB; iAB++) {
        var _b = listAliensBullets[iAB];
        _b.update();

        // Check if bullet goes outside display
        if (_b.y + _b.height < 0 || _b.y > display.height) {
            listAliensBullets.splice(iAB, 1);
            iAB--;
            lenAB--;
            continue;
        }

        // Check if bullet hits Player
        if (AABBCollision(_b.x, _b.y, _b.width, _b.height, player.x, player.y, player.sp.w, player.sp.h)) {
            init();
            break;
        }
    }
}

/**
 * Update display in case it is resized (responsiveness) and restart the game
 */
function updateScreen() {
    var _displayWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            _displayHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    display.update(_displayWidth, _displayHeight);
    init();
}

/**
 * Add aliens to the near top center of the display 
 * 
 * [CHALLENGE]
 * The enemies should be randomly placed in the game display.
 * Maximum of 5 enemies should be in the display at the same time.
 * [/CHALLENGE]
 */
function addAlien() {
    if (listAliens.length < MAX_ENEMIES) {
        var _quarter = display.width / 4;
        var _randomX = Math.floor(Math.random() * ((display.width - _quarter) - _quarter + 1) + _quarter);
        var _randomY = Math.floor(Math.random() * (display.height / 2 - BOUNDARY + 1) + BOUNDARY);

        listAliens.push(new Alien(spriteAlien, _randomX, _randomY, spriteAlien[0].w, spriteAlien[0].h, ENEMY_SPEED, ENEMY_POINTS));
    }
}

function addBoss() {
    if (!boss) {
        var _quarter = display.width / 4;
        var _randomX = Math.floor(Math.random() * ((display.width - _quarter) - _quarter + 1) + _quarter);
        var _randomY = Math.floor(Math.random() * (display.height / 2 - BOUNDARY + 1) + BOUNDARY);

        boss = new Alien(spriteBoss, _randomX, _randomY, spriteBoss[0].w, spriteBoss[0].h, ENEMY_SPEED * 10, ENEMY_POINTS * 8)
    }
}


/**
 * Render the game state to the canvas
 */
function render() {
    display.clear();

    // Draw score
    display.ctx.font = "30px SpaceInvaders";
    display.ctx.fillText("SCORE", BOUNDARY + 10, BOUNDARY + 30);
    display.ctx.font = "25px SpaceInvaders";
    display.ctx.fillText(player.points.pad(6), BOUNDARY + 10, BOUNDARY + 60);
    if (localStorage.getItem(STORAGE_BEST_SCORE)) {
        display.ctx.font = "9px SpaceInvaders";
        display.ctx.fillText("BEST " + Number(localStorage.getItem(STORAGE_BEST_SCORE)).pad(11), BOUNDARY + 10, BOUNDARY + 75);
    }


    // Draw boundaries
    display.ctx.fillStyle = "#333";
    display.ctx.fillRect(BOUNDARY, BOUNDARY, 1, display.height - BOUNDARY * 2);
    display.ctx.fillRect(display.width - BOUNDARY, BOUNDARY, 1, display.height - BOUNDARY * 2);

    // Draw aliens
    for (var i = 0, len = listAliens.length; i < len; i++) {
        var alien = listAliens[i];
        display.drawSprite(alien.sp[animate ? 1 : 0], alien.x, alien.y);
    }

    // Draw boss
    if (boss) {
        display.drawSprite(boss.sp[0], boss.x, boss.y);
    }

    // Fade out dead aliens
    // 
    // [CHALLENGE] 
    // If a bullet hits a enemy, the enemy should fade away slowly from the game display 
    // and as soon it fades out completely, a new one should appear in a random position
    // [/CHALLENGE]
    for (var i = 0, len = graveyard.length; i < len; i++) {
        var alien = graveyard[i];
        if (alien && alien.health > 0) {
            display.ctx.save();
            display.ctx.globalAlpha = alien.health;
            display.drawSprite(alien.sp[0], alien.x, alien.y);
            display.ctx.restore();
            graveyard[i].health -= 0.05;
        } else {
            graveyard.splice(i, 1);
            addAlien();
        }
    }

    // Draw bullets
    display.ctx.save();
    for (var i = 0, len = listBullets.length; i < len; i++) {
        display.drawBullet(listBullets[i]);
    }
    for (var i = 0, len = listAliensBullets.length; i < len; i++) {
        display.drawBullet(listAliensBullets[i]);
    }
    display.ctx.restore();

    // Draw player
    display.drawSprite(player.sp, player.x, player.y);
}
