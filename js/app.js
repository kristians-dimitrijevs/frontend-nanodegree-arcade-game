// initial score
let score = 0;
// initial number of lives
let lives = 3;
// modal
let modal = document.getElementById('myModal');
// button that starts the game again and resets the whole board
let btn = document.getElementById('play-again');
// span element that closes the modal
let span = document.getElementsByClassName("close")[0];

// Enemies player must avoid
let Enemy = function(x,y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png'
};
/**
 * Updates enemy's position
 * @param  {number} dt time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed * dt;

    // randomize speed after first run and reset back to initial position
    if (this.x >= 505) {
        this.x = -60;
        this.speed = 200 + Math.floor((Math.random() * 200) + 1);
    }

    // collision logic
    if (this.x < player.x + 60 && this.x + 60 > player.x && this.y < player.y + 40 && 40 + this.y > player.y) {

        player.reset();
        lives -= 1;
        // game over
        if (lives <= 0) {
            player.reset();
            lives = 3;
            openModal();
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    drawScore();
    drawLives()
};

/**
 * Displays score
 */
function drawScore() {
    ctx.font = '22px Jura';
    ctx.fillStyle = '#000000';
    ctx.fillText('Score: ' + score, 144, 20);
};

/**
 * Displays number of lives remaining
 */
function drawLives() {
    ctx.font = '22px Jura';
    ctx.fillStyle = '#000000';
    ctx.fillText('Lives: ' + lives, 264, 20);
};


/**
 * Player class
 * @param  {number} x initial player X position
 * @param  {number} y initial player Y position
 */
let Player = function (x,y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

/**
 * Player's update logic
 * handles player going offscreen
 * handles player reaching score area
 * increments lives for certain score counts
 * opens victory modal if score reached
 * @param  {number} dt time delta between ticks
 */
Player.prototype.update = function(dt) {

    // Keep player on canvas
    if (this.x > 400) {
        this.x = 400;
    }
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.y > 400) {
        this.y = 400;
    }
    if (this.y < 0) {
        this.y = 0;
        setTimeout(() => {
            this.reset();
            score += 10;
            if (score === 50 || score === 100 || score === 150) {
                lives += 1;
            }
            if (score === 200) {
                openModal(true);
            }
            }, 100);
        }
};

/**
 * Renders player
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Handles input of player movements
 * @param  {string} arrowKeyPress type of arrow key pressed
 */
Player.prototype.handleInput = function (arrowKeyPress) {
    if (arrowKeyPress == 'right') {
        this.x += 101;
    }
    if (arrowKeyPress == 'left') {
        this.x  -= 101;
    }
    if (arrowKeyPress == 'up') {
        this.y -= 84;
    }
    if (arrowKeyPress == 'down') {
      this.y += 84;
    }
};

/**
 * Resets player to initial position
 */
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 404;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [new Enemy(0, 60, 80), new Enemy(0, 140, 100), new Enemy(0, 225, 100)];

// Place the player object in a variable called player
let player = new Player(202,404);

// variable to disable movements when the modal dialog is active
let overlayActive = false;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down'
    };

    // only allow inputs when modal is not open
    if (!overlayActive) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});

/**
 * Opens modal dialog
 * @param  {Boolean} [win=false] whether to show a victory or loss message
 */
function openModal(win = false) {
    modal.style.display = 'block';
    if(win) {
        document.getElementById('winning').textContent = `Awesome! You won! Score: ${score}!`
    } else {
        document.getElementById('winning').textContent = `Your score is ${score}. If you want to play again press the button!`;
    }
    overlayActive = true;
    setupModalClose();
}

/**
 * Sets up listener for modal close button
 */
function setupModalClose() {

    btn.onclick = function() {
        modal.style.display = 'none';
        player.reset();
        score = 0;
        lives = 3;
        overlayActive = false;
        allEnemies = [new Enemy(0, 60, 80), new Enemy(0, 140, 100), new Enemy(0, 225, 100)];
    }

};
