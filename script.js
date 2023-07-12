/*----- constants -----*/

//Game configs
const players = [
  {
    name: "player1",
    displayName: "Player 1",
    controls: ["KeyA", "KeyS", "KeyD"],
    winCount: 0,
  },
  {
    name: "player2",
    displayName: "Player 2",
    controls: ["ArrowLeft", "ArrowDown", "ArrowRight"],
    winCount: 0,
  },
];

const gameInstructions = [
  {}, //TODO: add game 1 instructions
  {
    gameIndex: 1,
    title: "KOPITIAM HERO",
    imgHTML: "Image goes here",
    text: "Prepare the orders correctly!",
  },
];

/*----- Cached elements -----*/

//Navigation buttons
const homepageButtons = document.querySelector("#homepage-buttons");
const startButton = document.querySelector(".start");
const highScoreButton = document.querySelector(".highscore");
const homeButton = document.querySelector(".home");
const playGame1Button = document.querySelector("#playgame1");
const gameEndHomeButton = document.querySelector("#gohome");
const replayGame1Button = document.querySelector(".replaygame1");
const nextGameButton = document.querySelector(".next-game");

//Landing page elements
const homepage = document.querySelector(".homepage");
const highScorePage = document.querySelector(".highscorepage");
const highScoreTable = document.querySelector(".high-score-table");

//Game 1 page elements
const darumaBlock = document.querySelector(".darumablock");
const gameTimerDisplay = document.querySelectorAll(".player-timer");
const game1Page = document.querySelector(".game1page");
const game1InstructionPage = document.querySelector(".game1instructionpage");
const instructionPagePlayer1ControlDisplay = document.querySelector(
  "#player-1-instructions-control-display"
);
const instructionPagePlayer2ControlDisplay = document.querySelector(
  "#player-2-instructions-control-display"
);
const gameScreenBody = document.querySelector(".game-body");
const player1Screen = document.querySelector("#player-1-gamescreen");
const player2Screen = document.querySelector("#player-2-gamescreen");
const gameScreenPlayer1ControlDisplay = document.querySelector(
  "#player-1-gamescreen-control-display"
);
const gameScreenPlayer2ControlDisplay = document.querySelector(
  "#player-2-gamescreen-control-display"
);
players[0].gameScreen = player1Screen;
players[1].gameScreen = player2Screen;
const game1EndPage = document.querySelector(".game1endpage");

//Game 1 variables
const stackHeight = 1; // default stack height
let gameTimer = null;
let gameInterval = null;
const highScores = [
  // default high scores
  { name: "Desmond", score: 0.1 },
  { name: "Lian Kai", score: 0.1 },
  { name: "Chicken", score: 0.1 },
];
let game1WinnerScore = 0;
let highScoreNameInput = "";

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
const player2SuccessSound = new sound("./Assets/player2.wav");
const errorSound = new sound("./Assets/error.wav");
const highScoreSound = new sound("./Assets/victory.wav");
const gameOverSound = new sound("./Assets/gameover.wav");

/*----- event listeners -----*/

highScoreButton.addEventListener("click", renderHighScorePage);
homeButton.addEventListener("click", renderHomepage);
startButton.addEventListener("click", renderGame1Instructions);
playGame1Button.addEventListener("click", startGame1);
gameEndHomeButton.addEventListener("click", loadHomepage);
replayGame1Button.addEventListener("click", replayGame1);
nextGameButton.addEventListener("click", startNextGame);

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
function renderGame1Instructions() {
  homepage.style.display = "none"; //hide homepage
  game1InstructionPage.style.display = "block"; //render instructions page
  renderPlayerControls(
    players[0].controls,
    instructionPagePlayer1ControlDisplay
  );
  renderPlayerControls(
    players[1].controls,
    instructionPagePlayer2ControlDisplay
  );
}

//Start mini game when player clicks "Start" after viewing instructions
function startGame1() {
  renderGame1();
  playGame1();
}

//Functions to render minigame board
function renderGame1() {
  game1InstructionPage.style.display = "none"; //hide current page
  game1Page.style.display = "block"; //render game page
  players.forEach((player) => (player.gameScreen.innerHTML = ""));
  renderStack(generateRandomStack(stackHeight), players); //Randomly generate and display blocks
  renderPlayerControls(players[0].controls, gameScreenPlayer1ControlDisplay);
  renderPlayerControls(players[1].controls, gameScreenPlayer2ControlDisplay);
}
//generate array of random numbers
function generateRandomStack(stackHeight) {
  let randomArray = [];
  for (let i = 0; i < stackHeight; i++) {
    randomArray[i] = Math.floor(Math.random() * 3);
  }
  return randomArray;
}

//for each array item, generate a new block, assign color, and append to player's screen
function renderStack(numArray) {
  players.forEach((player) => {
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
      const playerScreen = player.gameScreen;
      playerScreen.append(newBlock);
    }
  });
}

//Render player's controls on game screen to guide player
function renderPlayerControls(playerControlArray, displayLocation) {
  displayLocation.innerHTML = "";
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
    if (playerControlArray[i] === "ArrowDown") {
      newBlock.innerText = "↓";
    } else if (playerControlArray[i] === "ArrowLeft") {
      newBlock.innerText = "←";
    } else if (playerControlArray[i] === "ArrowRight") {
      newBlock.innerText = "→";
    } else {
      newBlock.innerText = playerControlArray[i].charAt(3);
    }

    displayLocation.append(newBlock);
  }
}

//Game play. Detect player keystrokes and clear blocks
function playGame1() {
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
  if (players[0].controls.includes(e.code)) {
    //detect valid key input
    if (
      //compare with bottommost block
      players[0].controls.indexOf(e.code) ===
      parseInt(players[0].gameScreen.lastElementChild.getAttribute("value"))
    ) {
      player1SuccessSound.play();
      players[0].gameScreen.lastElementChild.remove();
    } else {
      errorSound.play();
    }
  } else if (players[1].controls.includes(e.code)) {
    if (
      players[1].controls.indexOf(e.code) ===
      parseInt(players[1].gameScreen.lastElementChild.getAttribute("value"))
    ) {
      player2SuccessSound.play();
      players[1].gameScreen.lastElementChild.remove();
    } else {
      errorSound.play();
    }
  } else {
    return;
  }
}

function checkForWin() {
  let winner = "";
  if (
    players[0].gameScreen.innerHTML === "" ||
    players[1].gameScreen.innerHTML === ""
  ) {
    clearInterval(gameInterval);
    gameOverSound.play();
    document.removeEventListener("keydown", checkForWin);
    //update winner
    if (players[0].gameScreen.innerHTML === "") {
      winner = players[0];
      players[0].winCount = players[0].winCount + 1;
      renderGameEndPage(players[0].displayName);
    } else {
      winner = players[1];
      players[1].winCount = players[1].winCount + 1;
      renderGameEndPage(players[1].displayName);
    }

    checkHighScore(winner, game1WinnerScore, highScores);
  }
}

function renderGameEndPage(winnerName) {
  game1Page.style.display = "none";
  game1EndPage.style.display = "block";

  //Display winner
  document.querySelector(".winning-player").innerText = `WINNER: ${winnerName}`;

  //Display scores
  game1WinnerScore = gameTimer / 100;
  document.querySelector(
    ".game-score-display"
  ).innerHTML = `Winner's Score: ${game1WinnerScore.toFixed(2)} secs`;
  document.querySelector("#player-1-win-count").innerHTML = players[0].winCount; //not working
  document.querySelector("#player-2-win-count").innerHTML = players[1].winCount;
}

function checkHighScore(winner, currentScore, highScores) {
  const isNewHighScore = (highScores) => currentScore < highScores.score;
  if (highScores.some(isNewHighScore)) {
    highScoreSound.play();
    highScoreNameInput = prompt(
      `${winner.displayName} wins! New high score! Enter your name:`
    ); //Get player name
    //Update high score table
    highScores.push({ name: highScoreNameInput, score: currentScore });
    highScores.sort((a, b) => {
      return a.score - b.score;
    });
    highScores.pop();
  }
}

//When player clicks "Home", go back to homepage
function loadHomepage() {
  game1EndPage.style.display = "none";
  homepage.style.display = "block";
}
//When player clicks "Play again", play same game again
function replayGame1() {
  game1EndPage.style.display = "none";
  game1InstructionPage.style.display = "block";
}

//---  GAME 2  ---

//TODO: Build game 2 instruction skeleton
function startNextGame() {
  console.log("Load next game's instructions");
  game1EndPage.style.display = "none"; //hide gamepage
  game1InstructionPage.style.display = "block"; //render instructions page

  //render next game instructions
  document.querySelector(".instructions-title").innerText =
    gameInstructions[1].title;
  document.querySelector(".instructions-screenshot").innerHTML =
    gameInstructions[1].imgHTML;
  document.querySelector(".instructions-text").innerHTML =
    gameInstructions[1].text;

  //remove game 1 start button
  playGame1Button.remove();

  //append game 2 start button
  let startGame2Button = document.createElement("button");
  startGame2Button.innerText = "Start!";
  startGame2Button.setAttribute("class", "btn btn-danger");
  startGame2Button.setAttribute("id", "playgame2");
  game1InstructionPage.appendChild(startGame2Button);
  startGame2Button.addEventListener("click", startGame2);
}

function startGame2() {
  console.log("Start game 2");
  //render game 2 page

  renderGame2();
  //playGame2();
}
function renderGame2() {
  console.log("Render game 2");
  game1InstructionPage.style.display = "none"; //hide current page
  document.querySelector(".game2page").style.display = "block"; //render game page
  //TODO: Build game 2 page skeleton
}

/*----- main function -----*/
init();
