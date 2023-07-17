// Game configuration
const rodSpeed = 25; // Adjust the rod speed as needed
const ballSpeed = 4; // Adjust the ball speed as needed

// Game state
let score = 0;
let highestScore = localStorage.getItem("highestScore");
let highestScorer = localStorage.getItem("highestScorer");

if (highestScore === null) {
  highestScore = 0;
  highestScorer = "No record yet. This is your first time!";
}

const highestScoreDisplay = document.querySelector("#highest-score");
const topRod = document.querySelector(".top-rod");
const bottomRod = document.querySelector(".bottom-rod");
const ball = document.querySelector(".ball");
const gameContainer = document.querySelector(".game-container");
let gameWidth, gameHeight;

if (gameContainer) {
  gameWidth = gameContainer.clientWidth;
  gameHeight = gameContainer.clientHeight;
} else {
  alert("Error: Game container not found.");
}

// Function to move rods
function moveRods(event) {
  if (event.key === "ArrowLeft") {
    const leftPosition = parseInt(window.getComputedStyle(topRod).left);
    if (leftPosition > 0) {
      topRod.style.left = `${leftPosition - rodSpeed}px`;
      bottomRod.style.left = `${leftPosition - rodSpeed}px`;
    }
  } else if (event.key === "ArrowRight") {
    const leftPosition = parseInt(window.getComputedStyle(topRod).left);
    if (leftPosition + topRod.clientWidth < gameWidth) {
      topRod.style.left = `${leftPosition + rodSpeed}px`;
      bottomRod.style.left = `${leftPosition + rodSpeed}px`;
    }
  }
}

// Function to move the ball
function moveBall() {
  if (!gameContainer) {
    alert("Error: Game container not found.");
    return;
  }

  let ballLeft = parseInt(window.getComputedStyle(ball).left);
  let ballTop = parseInt(window.getComputedStyle(ball).top);
  let ballDirectionX = 1;
  let ballDirectionY = 1;

  function updateBallPosition() {
    ballLeft += ballSpeed * ballDirectionX;
    ballTop += ballSpeed * ballDirectionY;
    ball.style.left = `${ballLeft}px`;
    ball.style.top = `${ballTop}px`;
  }

  function checkCollision() {
    // Collision with rods
    if (ballTop + ball.clientHeight >= gameHeight - bottomRod.clientHeight) {
      const rodLeft = parseInt(window.getComputedStyle(bottomRod).left);
      const rodRight = rodLeft + bottomRod.clientWidth;
      if (ballLeft + ball.clientWidth >= rodLeft && ballLeft <= rodRight) {
        ballDirectionY = -1;
        score++;
      }
    } else if (ballTop <= topRod.clientHeight) {
      const rodLeft = parseInt(window.getComputedStyle(topRod).left);
      const rodRight = rodLeft + topRod.clientWidth;
      if (ballLeft + ball.clientWidth >= rodLeft && ballLeft <= rodRight) {
        ballDirectionY = 1;
        score++;
      }
    }

    // Collision with walls
    if (ballLeft + ball.clientWidth >= gameWidth || ballLeft <= 0) {
      ballDirectionX *= -1;
    }

    // Ball goes below the rods
    if (ballTop + ball.clientHeight >= gameHeight) {
      endGame();
    }
  }

  function animateBall() {
    updateBallPosition();
    checkCollision();
    requestAnimationFrame(animateBall);
  }

  animateBall();
}

function endGame() {
  if (score > highestScore) {
    highestScore = score;
    highestScorer = prompt(
      "Congratulations! You scored the highest. Enter your name:"
    );
    localStorage.setItem("highestScore", highestScore);
    localStorage.setItem("highestScorer", highestScorer);
  }

  highestScoreDisplay.textContent = `Highest Score: ${highestScore} by ${highestScorer}`;
  const existingGameOverMessage = document.querySelector(".game-over-message");
  if (existingGameOverMessage) {
    gameContainer.removeChild(existingGameOverMessage);
  }
  const gameOverMessage = document.createElement("div");
  gameOverMessage.classList.add("game-over-message");
  gameOverMessage.textContent = `Game Over! Winner: ${highestScorer} - Score: ${score}`;
  gameContainer.appendChild(gameOverMessage);

  score = 0;
  topRod.style.left = `${(gameWidth - topRod.clientWidth) / 2}px`;
  bottomRod.style.left = `${(gameWidth - bottomRod.clientWidth) / 2}px`;
}


// Event listener for rod movements
document.addEventListener("keydown", moveRods);

// Start the game
moveBall();
