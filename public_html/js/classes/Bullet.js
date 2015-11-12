/**
 * Bullet class 
 * 
 * @param {Number}  x     -  X position
 * @param {Number}  y     -  Y position
 * @param {Number}  vely  -  Velocity in Y direction
 * @param {Number}  w     -  Width in pixels
 * @param {Number}  h     -  Height in pixels
 * @param {String}  color -  Hex-color of bullet
 * @returns {Bullet}
 */
function Bullet(x, y, vely, w, h, color) {
    this.x = x;
    this.y = y;
    this.vely = vely;
    this.width = w;
    this.height = h;
    this.color = color;
}

/**
 * Update bullet position according to it's velocity
 */
Bullet.prototype.update = function () {
    this.y += this.vely;
};

