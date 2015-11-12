/**
 * Player class
 * 
 * @param {Sprite} sp    -  Player's sprite
 * @param {Number} x     -  X position
 * @param {Number} y     -  Y position
 * @param {Number} speed -  How fast will it move
 * @returns {Player}
 */
function Player(sp, x, y, speed) {
    this.sp = sp;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.health = 100;
    this.points = 0;
}

Player.prototype.score = function(points){
    this.points += points;
    
     if (typeof (Storage) !== "undefined") {
        var _bestScore = localStorage.getItem(STORAGE_BEST_SCORE);
        if (player.points > _bestScore) {
            localStorage.setItem(STORAGE_BEST_SCORE, player.points);
        }
    }
}

Player.prototype.moveLeft = function () {
    this.x -= this.speed;
};

Player.prototype.moveRight = function () {
    this.x += this.speed;
};