/* ____    ___       _      _       ____  
  / ___|  / _ \     / \    | |     / ___| 
 | |  _  | | | |   / _ \   | |     \___ \ 
 | |_| | | |_| |  / ___ \  | |___   ___) |
  \____|  \___/  /_/   \_\ |_____| |____/ 
                       
1) Move the frog in every direction
2) Move the car
  - reset car from right to left
3) Detect if the car hits the frog
  - lose a life
  - move frog back to start
4) Detect when the frog gets to the glade
  - 

  ____    _____   ____    _____   _____    ____   _   _ 
 / ___|  |_   _| |  _ \  | ____| |_   _|  / ___| | | | |
 \___ \    | |   | |_) | |  _|     | |   | |     | |_| |
  ___) |   | |   |  _ <  | |___    | |   | |___  |  _  |
 |____/    |_|   |_| \_\ |_____|   |_|    \____| |_| |_|

1) Add multiple cars.
2) Add a certain goal - i.e. score 5 times to end the game.
3) Make it so that you can only move the frog if the game
   is not over.
4) Make the game get more and more challenging as you win
   more and more times.
5) Color code your player pieces.
6) Using some ideas from yesterday’s game, add some
   collectible power-ups that make you temporarily
   invincible, faster, smaller, or rainbow-colored.
7) Add features like a river to the background - make some
   additional modifications to the gameplay - perhaps
   falling into the river also sends you back. Add logs
   that float.
   
   https://developers.google.com/web/tools/chrome-devtools/javascript

*/

// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global
 *    createCanvas, background
 *    colorMode, HSB, fill
 *    ellipse, rect
 *    random, key
 *    width, height
 *    keyCode, keyIsPressed, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW
 *    text, textSize,
 *    collideRectCircle, textFont,
 */

let backgroundColor,
  frogX,
  frogY,
  score,
  hiScore,
  lives,
  gameIsOver,
  winner,
  car1X,
  car1Y,
  car1V,
  car2X,
  car2Y,
  car2V,
  car3X,
  car3Y,
  car3V,
  log1X,
  log1V,
  riverY;

function setup() {
  // Canvas & color settings
  createCanvas(500, 500);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  frogX = width / 2;
  frogY = height - 20;
  score = hiScore = 0;
  lives = 3;
  gameIsOver = winner = false;

  car1X = 0;
  car1Y = height / 5 - 30;
  car1V = score * 0.25 + 2;
  car2X = car3X = width;
  car2Y = 300;
  car2V = 5;
  car3Y = 370;
  car3V = 1;

  log1X = 0;
  log1V = 1;
  riverY = 200;
}

function draw() {
  background(backgroundColor);
  // Code for gold goal line
  fill("");
  rect(0, 0, width, 50);

  moveCars();
  drawCars();
  drawRiver();
  checkCollisions();
  checkWin();
  displayScores();

  // Code to display Frog
  fill(120, 80, 80);
  ellipse(frogX, frogY, 20);
}

function moveCars() {
  // Move the car
  car1X += car1V;
  car2X -= car2V;
  car3X -= car3V;
  log1X += log1V;
  // Reset if it moves off screen
  if (car1X >= width) {
    car1X = 0;
  }
  if (car2X <= 0) {
    car2X = width;
  }
  if (car3X <= 0) {
    car3X = width;
  }

  if (log1X >= width) {
    log1X = 0;
  }
}

function drawRiver() {
  //river
  fill(240, 80, 80);
  rect(0, riverY, width, 30);

  //log
  fill(0, 50, 30);
  rect(log1X, 200, 60, 30);
}

function drawCars() {
  // Code for car 1
  fill(0, 80, 80);
  rect(car1X, car1Y, 40, 30);
  rect(car1X, car1Y + 80, 40, 30);

  // Code for additional cars
  //code for car2, yellow
  fill(50, 80, 100);
  rect(car2X, car2Y, 20, 20);

  //code for car3, black
  fill(20);
  rect(car3X, car3Y, 50, 50);
}

function checkCollisions() {
  // If the frog collides with car1, reset the frog and subtract a life.
  //car1 collision
  var hit = false;
  hit = collideRectCircle(car1X, car1Y, 40, 30, frogX, frogY, 20);
  //car2 collision
  var hit2 = false;
  hit2 = collideRectCircle(car2X, car2Y, 20, 20, frogX, frogY, 20);
  //car3 collision
  var hit3 = false;
  hit3 = collideRectCircle(car3X, car3Y, 50, 50, frogX, frogY, 20);
  //car3 collision
  var hit4 = false;
  hit4 = collideRectCircle(car1X, car1Y + 80, 40, 30, frogX, frogY, 20);
  if (hit || hit2 || hit3 || hit4) {
    frogX = width / 2;
    frogY = height - 20;
    lives--;
  }

  //fall into river
  var drown = false;
  var logJump = false;
  drown = collideRectCircle(0, riverY, width, 30, frogX, frogY, 20);
  logJump = collideRectCircle(log1X, 200, 60, 30, frogX, frogY, 20);
  if (drown) {
    if (!logJump) {
      console.log("You drowned");
      frogX = width / 2;
      frogY = height - 20;
      lives--;
    } else if (logJump) {
      frogX += log1V;
      if(frogX >= width){
        console.log("You drowned");
        frogX = width / 2;
        frogY = height - 20;
        lives--;
      }
    }
  }
  if (lives <= 0) {
    gameIsOver = true;
  }
}

function checkWin() {
  // If the frog makes it into the yellow gold zone, increment the score
  // and move the frog back down to the bottom.
  if (frogY <= 50) {
    car1X = 0;
    score++;
    text("Score +1", frogX, frogY);
    frogX = width / 2;
    frogY = height - 20;
    text("+1", frogX, frogY);
    if (score > hiScore) {
      hiScore = score;
    }
  }
  if (score >= 5) {
    winner = true;
  }
}

function displayScores() {
  textSize(12);
  fill(0);
  // Display Lives
  text(`Lives: ${lives}`, 10, 20);
  // Display Score
  text(`Score: ${score}`, 10, 40);
  text(`High Score: ${hiScore}`, 400, 40);
  // Display game over message if the game is over
  if (gameIsOver || winner) {
    if (gameIsOver) {
      textFont("Comic", 70);
      text(`GAME OVER`, 40, 50, width, 400);
    }
    if (winner) {
      textFont("Comic", 70);
      text(`YOU WIN!`, 40, 40, width, 400);
    }

    text(`Your Score: ${score}`, 60, 180);
    textFont("Comic", 40);
    text("Press the R key to play again", 60, 280, 400);
    car1V = car2V = car3V = log1V = 0;
    if (keyIsPressed && (key == "r" || key == "R")) {
      gameIsOver = false;
      score = 0;
      lives = 3;

      car1X = 0;
      car1Y = height / 5 - 30;
      car1V = score * 0.25 + 2;
      car2X = car3X = width;
      car2Y = 400;
      car2V = 5;
      car3Y = 300;
      car3V = 1;

      log1X = 0;
      log1V = 1;
    }
  }
}
function keyPressed() {
  if (!gameIsOver && !winner) {
    if (keyCode === UP_ARROW) {
      frogY -= 10;
    }
    if (keyCode === LEFT_ARROW) {
      frogX -= 10;
    }
    if (keyCode === RIGHT_ARROW) {
      frogX += 10;
    }
    if (keyCode === DOWN_ARROW) {
      frogY += 10;
    }
  }
}
