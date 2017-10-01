var isBetween = function(n, a, b) {
    return (n - a) * (n - b) <= 0;
}

var highScore = localStorage.getItem("highScore");

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.initPosition();
    this.initSpeed();
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.checkCollision();
    this.x += this.speed * dt;
    if (this.x > 505) {
        this.initPosition();
        this.initSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 101, 83);
};

Enemy.prototype.initPosition = function() {
    var positions = [125, 208, 291];
    this.x = -101;
    this.y = positions[Math.floor(Math.random() * 3)];

}

Enemy.prototype.initSpeed = function() {
    var speeds = [100, 150, 200, 250, 300, 350, 400, 450, 500];
    this.speed = speeds[Math.floor(Math.random() * 9)];
}

Enemy.prototype.checkCollision = function() {
    if ((isBetween(player.x, this.x, this.x + 60) || isBetween(player.x + 101, this.x + 35, this.x + 101)) && isBetween(player.y + 100, this.y, this.y + 83)) {
        player.initPosition();
        player.reduceLife();
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.gameOver = false;
    this.score = 0;
    this.life = 3;
    this.initPosition();
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function() {
    this.displayDetails();
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(move) {
    if (move == "left" && this.x > 0) {
        this.x -= 101;
    }
    if (move == "right" && this.x < 404) {
        this.x += 101;
    }
    if (move == "up" && this.y > 0) {
        this.y -= 83;
        if (this.y <= 0) {
            this.y = 380;
            this.handleScore();
        }
    }
    if (move == "down" && this.y < 380) {
        this.y += 83;
    }
}

Player.prototype.reduceLife = function() {
    (this.life > 0) ? this.life -= 1: this.endGame();
}

Player.prototype.endGame = function() {
    this.gameOver = true;
    var finalScore = this.score;
    var finalMax = localStorage.getItem("highScore");
    $(".endGame").fadeIn("slow");
    $("button").click(function() {
        window.location.reload();
    });

}


Player.prototype.handleScore = function() {
    if (!this.gameOver) {
        this.score += 10;
        if (highScore !== null) {
            if (this.score > highScore) {
                localStorage.setItem("highScore", this.score);
            }
        } else {
            localStorage.setItem("highScore", this.score);
        }
    }
}

Player.prototype.initPosition = function() {
    this.x = 202;
    this.y = 380;
}

Player.prototype.displayDetails = function() {
    document.getElementById("score").textContent = this.score;
    document.getElementById("highScore").textContent = localStorage.getItem("highScore");
    document.getElementById("lifeRemains").textContent = this.life;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function listenKey(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
