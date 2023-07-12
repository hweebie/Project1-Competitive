/*----- constants -----*/

//Game configs
const highScores = [
  // default high scores
  { name: "Desmond", score: 6.0 },
  { name: "Lian Kai", score: 8.0 },
  { name: "Chicken", score: 10.0 },
];

//Player variables
let player1Score = 0;
let player1Name = "";
const player1Controls = ["KeyA", "KeyS", "KeyD"]; //Player 1's key controls.

/*----- Cached elements -----*/
//Game variables
const stackHeight = 20; // default stack height
let gameTimer = null;
let gameInterval = null;

//Navigation buttons
const homepageButtons = document.querySelector("#homepage-buttons");
const startButton = document.querySelector(".start");
const highScoreButton = document.querySelector(".highscore");
const homeButton = document.querySelector(".home");
const playMiniGameButton = document.querySelector("#playminigame");
const playAgainButton = document.querySelector("#playagain");

//Game elements
const homepage = document.querySelector(".homepage");
const gamePage = document.querySelector(".gamepage");
const highScorePage = document.querySelector(".highscorepage");
const highScoreTable = document.querySelector(".high-score-table");
const gameTimerDisplay = document.querySelectorAll(".player-timer");

//Minigame elements
const instructionPage = document.querySelector(".instructionpage");
const gameScreenBody = document.querySelector(".game-body");
const player1Screen = document.querySelector("#player-1-gamescreen");
const playerControlDisplay = document.querySelector(".player-controls");
const darumaBlock = document.querySelector(".darumablock");
const gameOverScreen = document.querySelector(".game-over-page");

//Sound constructor
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}
const player1SuccessSound = new sound("./Assets/player1.wav");
const errorSound = new sound("./Assets/error.wav");
const highScoreSound = new sound("./Assets/victory.wav");
const gameOverSound = new sound("./Assets/gameover.wav");

/*----- event listeners -----*/

highScoreButton.addEventListener("click", renderHighScorePage);
homeButton.addEventListener("click", renderHomepage);
startButton.addEventListener("click", startGame);
playMiniGameButton.addEventListener("click", playMiniGame);
playAgainButton.addEventListener("click", playAgain);

/*----- functions -----*/

//Render homepage
function init() {
  homepage.style.display = "block"; //load homepage
}

//Render high scores page. Triggered by button click
function renderHighScorePage() {
  homepage.style.display = "none";
  highScorePage.style.display = "block";
  renderHighScoreTable(highScores);
}

//Render high score table based on latest highScores array
function renderHighScoreTable(highScores) {
  //clear old scores and build header
  highScoreTable.innerHTML = `<thead class="table-active">
  <tr>
    <th scope="col">Name</th>
    <th scope="col">Score</th>
  </tr>
</thead>`;
  //populate table with data from highScores array
  for (player of highScores) {
    const newRow = document.createElement("tr");
    const tdName = document.createElement("td");
    tdName.innerText = player.name;
    const tdScore = document.createElement("td");
    tdScore.innerText = player.score.toFixed(2);
    newRow.appendChild(tdName);
    newRow.appendChild(tdScore);
    highScoreTable.appendChild(newRow);
  }
}

//Go back from high score page to homepage. Triggered by button click
function renderHomepage() {
  highScorePage.style.display = "none"; //hide current page
  homepage.style.display = "block"; //render high score page
}

//Render game instructions. Triggered by player clicking "Start"
function startGame() {
  homepage.style.display = "none"; //hide homepage
  instructionPage.style.display = "block"; //render instructions page
}

//Start mini game when player clicks "Start" after viewing instructions
function playMiniGame() {
  renderGame();
  playGame();
}

//Functions to render minigame board
function renderGame() {
  instructionPage.style.display = "none"; //hide current page
  gamePage.style.display = "block"; //render game page
  renderStack(generateRandomStack(stackHeight)); //Randomly generate and display blocks
  renderPlayerControls(player1Controls);
}

function generateRandomStack(stackHeight) {
  let randomArray = [];
  for (let i = 0; i < stackHeight; i++) {
    randomArray[i] = Math.floor(Math.random() * 3);
  }
  return randomArray;
}

function renderStack(numArray) {
  //for each item, generate a new block, assign color, and append to player's screen
  for (let i = 0; i < numArray.length; i++) {
    const newBlock = document.createElement("div");
    newBlock.setAttribute("class", "daruma-block");
    newBlock.setAttribute("value", numArray[i]);

    if (numArray[i] == 0) {
      newBlock.style.backgroundColor = "red";
      newBlock.innerText = "ʕ•́ᴥ•̀ʔ";
    } else if (numArray[i] == 1) {
      newBlock.style.backgroundColor = "green";
      newBlock.innerText = "(◕ ‿ ◕)";
    } else {
      newBlock.style.backgroundColor = "blue";
      newBlock.innerText = "(ಠ ‿ ಠ)";
    }

    player1Screen.append(newBlock);
  }
}

//Render player's controls on game screen to guide player
function renderPlayerControls(playerControlArray) {
  playerControlDisplay.innerHTML = "";
  for (let i = 0; i < playerControlArray.length; i++) {
    const newBlock = document.createElement("div");
    newBlock.setAttribute("class", "player-control-key");
    //assign colour
    if (i == 0) {
      newBlock.style.backgroundColor = "red";
    } else if (i == 1) {
      newBlock.style.backgroundColor = "green";
    } else if (i == 2) {
      newBlock.style.backgroundColor = "blue";
    }
    //append to player's screen
    newBlock.innerText = playerControlArray[i].charAt(3);
    playerControlDisplay.append(newBlock);
  }
}

//Game play. Detect player keystrokes and clear blocks
function playGame() {
  gameTimer = 0;
  gameInterval = setInterval(incrementTimer, 10);
  function incrementTimer() {
    gameTimer++;
    timerDisplay = gameTimer / 100;
    gameTimerDisplay.forEach((timer) => {
      timer.innerHTML = timerDisplay.toFixed(2);
    }); //display timer to 2 decimal points
  }

  document.addEventListener("keydown", clearBlocks); //clear blocks if player enters right key
  document.addEventListener("keydown", checkForWin); //check whether player won
}

function clearBlocks(e) {
  if (player1Controls.includes(e.code)) {
    //detect valid key input
    if (
      //compare with bottommost block
      player1Controls.indexOf(e.code) ===
      parseInt(player1Screen.lastElementChild.getAttribute("value"))
    ) {
      player1SuccessSound.play();
      player1Screen.lastElementChild.remove();
    } else {
      errorSound.play();
    }
  } else {
    return;
  }
}

function checkForWin() {
  if (player1Screen.innerHTML === "") {
    clearInterval(gameInterval);
    gameOverSound.play();
    renderGameEndPage();
    checkHighScore(player1Score, highScores);
  }
}

function renderGameEndPage() {
  gamePage.style.display = "none";
  gameOverScreen.style.display = "block";
  player1Score = gameTimer / 100;
  document.querySelector(".score-display").innerHTML = player1Score.toFixed(2); //display timer to 2 decimal points;
}

function checkHighScore(currentScore, highScores) {
  const isNewHighScore = (highScores) => currentScore < highScores.score;
  if (highScores.some(isNewHighScore)) {
    highScoreSound.play();
    player1Name = prompt("New high score! Enter your name:"); //Get player name
    //Update high score table
    highScores.push({ name: player1Name, score: currentScore });
    highScores.sort((a, b) => {
      return a.score - b.score;
    });
    highScores.pop();
  }
}

//When player clicks "Play again", go back to homepage
function playAgain() {
  gameOverScreen.style.display = "none"; //hide gamepage
  document.querySelector(".homepage").style.display = "block"; //render homepage
}
/*----- main function -----*/
init();
