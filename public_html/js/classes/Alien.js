/**
 * Alien class
 * 
 * @param {Sprite} sp     -  Sprite
 * @param {Number} x      -  X position
 * @param {Number} y      -  Y position
 * @param {Number} w      -  Width in pixels
 * @param {Number} h      -  Height in pixels 
 * @param {Number} speed  -  Speed which it moves
 * @param {Number} points -  Points worth it
 * @returns {Alien}
 */
function Alien(sp, x, y, w, h, speed, points) {
    this.sp = sp;
    this.x = x;
    this.y = y;
    this.x2 = x;
    this.y2 = y;
    this.w = w;
    this.h = h;
    this.dir = Math.random() > 0.5 ? 1 : -1;
    this.health = 1;
    this.speed = speed;
    this.points = points;
}