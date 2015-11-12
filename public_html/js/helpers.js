/**
 * Check if object A collides with object B
 * 
 * @param {Number} ax -  A X position
 * @param {Number} ay -  A Y position
 * @param {Number} aw -  A width
 * @param {Number} ah -  A height
 * @param {Number} bx -  B X position
 * @param {Number} by -  B Y position
 * @param {Number} bw -  B width
 * @param {Number} bh -  B height
 * @returns {Boolean} Did or not collide
 */
function AABBCollision(ax, ay, aw, ah, bx, by, bw, bh) {
    return ((ax < (bx + bw))
            && (bx < (ax + aw))
            && (ay < (by + bh))
            && (by < (ay + ah)));
}

/**
 * Abstracted canvas class usefull in games
 * 
 * @param {Number} width  -  Width of canvas in pixels
 * @param {Number} height -  Height of canvas in pixels
 */
function Screen(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    this.ctx = this.canvas.getContext("2d");

    document.body.appendChild(this.canvas);
}

/**
 * Clear the complete canvas (usually cleared every frame)
 */
Screen.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
};

/**
 * Draw a sprite instance to the canvas
 * 
 * @param  {Sprite} sp -  The sprite to draw
 * @param  {Number}  x -  X-coordinate to draw sprite
 * @param  {Number}  y -  Y-coordinate to draw sprite
 */
Screen.prototype.drawSprite = function (sp, x, y) {
    this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
};

/**
 * Draw a bullet instance to the canvas
 * 
 * @param  {Bullet} bullet -  The bullet to draw
 */
Screen.prototype.drawBullet = function (bullet) {
    this.ctx.fillStyle = bullet.color;
    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
};

Screen.prototype.restart = function (w, h) {
    this.canvas.width = this.width = w;
    this.canvas.height = this.height = h;
    this.ctx.clearRect(0, 0, this.width, this.height);
};

/**
 * Sprite object, uses sheet image for compressed space
 * 
 * @param {Image}  img -  Sheet image
 * @param {Number} x   -  Start x on image
 * @param {Number} y   -  Start y on image
 * @param {Number} w   -  Width of asset
 * @param {Number} h   -  Height of asset
 */
function Sprite(img, x, y, w, h) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}


/**
 * InputHandeler class, handle pressed keys
 */
function InputHandeler() {
    this.down = {};
    this.pressed = {};
    // capture key presses
    var _this = this;
    document.addEventListener("keydown", function (evt) {
        _this.down[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function (evt) {
        delete _this.down[evt.keyCode];
        delete _this.pressed[evt.keyCode];
    });
}

/**
 * Returns whether a key is pressod down
 * 
 * @param  {Number} code -  The keycode to check
 * @return {Boolean} The result from check
 */
InputHandeler.prototype.isDown = function (code) {
    return this.down[code];
};

/**
 * Return wheter a key has been pressed
 * 
 * @param  {Number} code -  The keycode to check
 * @return {Boolean} The result from check
 */
InputHandeler.prototype.isPressed = function (code) {
    // If key is registred as pressed return false
    // Else if key down for first time return true 
    // Else return false
    if (this.pressed[code]) {
        return false;
    } else if (this.down[code]) {
        return this.pressed[code] = true;
    }
    return false;
};

/**
 * Return a number with 'size' leading zeros
 * 
 * @param {type} size -  How many numbers 
 * @returns {String|Number.prototype.pad.s}
 */
Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}