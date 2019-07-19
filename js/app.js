let score = 0;
let lives = 3;
// Get the modal
let modal = document.getElementById('myModal');

// Get the button that starts the game again and resets the whole board
let btn = document.getElementById('play-again');

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// Enemies our player must avoid
let Enemy = function(x,y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.sprite = 'images/enemy-bug.png'
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += this.speed * dt;

    // https://www.w3schools.com/jsref/jsref_random.asp
    if (this.x >= 505) {
        this.x = -60;
        this.speed = 200 + Math.floor((Math.random() * 200) + 1);
    }

    if (this.x < player.x + 60 && this.x + 60 > player.x && this.y < player.y + 40 && 40 + this.y > player.y) {

        player.reset();
        lives -= 1;
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

function drawScore() {
    ctx.font = '22px Jura';
    ctx.fillStyle = '#000000';
    ctx.fillText('Score: ' + score, 144, 20);
};

function drawLives() {
    ctx.font = '22px Jura';
    ctx.fillStyle = '#000000';
    ctx.fillText('Lives: ' + lives, 264, 20);
};


// Now write your own player class

let Player = function (x,y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

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
            player.reset();
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

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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

// Resetting players position
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 404;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let allEnemies = [new Enemy(0, 60, 80), new Enemy(0, 140, 100), new Enemy(0, 225, 100)];

// Place the player object in a variable called player
let player = new Player(202,404);

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

    if (!overlayActive) {
      player.handleInput(allowedKeys[e.keyCode]);
    }
});

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

// Dismiss the modal
function setupModalClose() {

    btn.onclick = function() {
        modal.style.display = 'none';
        player.reset();
        score = 0;
        lives = 3;
        overlayActive = false;
        // Engine.reset();
        allEnemies = [new Enemy(0, 60, 80), new Enemy(0, 140, 100), new Enemy(0, 225, 100)];
    }


  /*  span.onclick = function() {
        modal.style.display = 'none';
        player.reset();
        score  = 0;
        lives = 3;
    }

    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = 'none';
          player.reset();
          score = 0;
          lives = 3;
        }
    }
  */
};
