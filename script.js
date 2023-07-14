/*----- Constants -----*/

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

const games = [
  {
    gameIndex: 1,
    title: "JUST WHACK ONLY!",
    imgHTML: `<img
    src="./Assets/minigame-1-instructions.gif"
    alt="Image showing game walkthrough"
    id="instructions-image"
  />`,
    text: `<p>Hit the same colour as that of the bottom block.</p>
    <p><strong>The fastest player wins!</strong></p>`,
  }, //TODO: update game 1 instructions
  {
    gameIndex: 2,
    title: "KOPITIAM HERO",
    imgHTML: `<img
    src="./Assets/minigame-2-instructions.gif"
    alt="Image showing game walkthrough"
    id="instructions-image"
  />`,
    text: `<p>Press the buttons to match each order precisely.</p>
    <p><strong>Too many items will spoil your job.</strong></p>
    <p>Compete for time! </strong>Get 3 orders to win.</strong>`,
  },
];

/*----- Cached elements -----*/

//Navigation buttons
const startButton = document.querySelector(".start");
const highScoreButton = document.querySelector(".highscore");
const highScoreHomeButton = document.querySelector(".home");
const gameEndHomeButton = document.querySelector("#gohome");
const playGame1Button = document.querySelector("#playgame1");
const playGame2Button = document.querySelector("#playgame2");
const replayGame1Button = document.querySelector(".replaygame1");
const nextGameButton = document.querySelector(".next-game");

//Core pages and page templates (instructions, gamescreen, game end page)
const homepage = document.querySelector(".homepage");
const highScorePage = document.querySelector(".highscorepage");
const highScoreTable = document.querySelector(".high-score-table");
const gamePage = document.querySelector(".gamepage");
const gameEndPage = document.querySelector(".gameendpage");
const instructionPage = document.querySelector(".instructionpage");
const instructionPagePlayer1ControlDisplay = document.querySelector(
  "#player-1-instructions-control-display"
);
const instructionPagePlayer2ControlDisplay = document.querySelector(
  "#player-2-instructions-control-display"
);
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
const orderSuccessSound = new sound("./Assets/successfulorder.wav");

/*----- Game 1 variables and game elements -----*/
//Variables
const stackHeight = 15; // default stack height
let gameTimer = null;
let gameInterval = null;
const highScores = [
  // default high scores
  { name: "Desmond", score: 5 },
  { name: "Lian Kai", score: 6 },
  { name: "Chicken", score: 20 },
];
let game1WinnerScore = 0;
let highScoreNameInput = "";

//Game elements
const gameTimerDisplay = document.querySelectorAll(".player-timer");

/*----- Game 2 variables and game elements -----*/
//Variables
const maxOrderPerItem = 4;
const maxGame2Rounds = 6;
let player1Game2Score = 0;
let player2Game2Score = 0;
let orderArray = [];
let player1Game2Input = [null, null, null];
let player2Game2Input = [null, null, null];

//Game elements
const player1ScoreDisplayBox = document.querySelector(".player1-score-display");
const player2ScoreDisplayBox = document.querySelector(".player2-score-display");

/*----- event listeners -----*/

highScoreButton.addEventListener("click", renderHighScorePage);
highScoreHomeButton.addEventListener("click", () =>
  switchPages(highScorePage, homepage)
);
startButton.addEventListener("click", () =>
  renderGameInstructions(homepage, games[0])
); //render game 1 instructions
nextGameButton.addEventListener("click", () =>
  renderGameInstructions(gameEndPage, games[1])
); //render game 2 instructions
gameEndHomeButton.addEventListener("click", () =>
  switchPages(gameEndPage, homepage)
);
playGame1Button.addEventListener("click", startGame1);
playGame2Button.addEventListener("click", startGame2);
replayGame1Button.addEventListener("click", () => {
  console.log("clicked");
  switchPages(gameEndPage, instructionPage);
});

/*----- Game functions -----*/

//Render homepage
function init() {
  homepage.style.display = "block"; //load homepage
}

//Function to switch pages
function switchPages(currentPage, newPage) {
  currentPage.style.display = "none";
  newPage.style.display = "block";
}

//Render high scores page
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

//Render game instructions using game data
function renderGameInstructions(currentPage, gameObject) {
  currentPage.style.display = "none"; //hide homepage
  instructionPage.style.display = "block"; //render instructions page
  document.querySelector(".instructions-title").innerText = gameObject.title;
  document.querySelector(".instructions-screenshot").innerHTML =
    gameObject.imgHTML;
  document.querySelector(".instructions-text").innerHTML = gameObject.text;

  renderPlayerControls(players[0], instructionPagePlayer1ControlDisplay);
  renderPlayerControls(players[1], instructionPagePlayer2ControlDisplay);

  //Render button to start the current game
  if (gameObject.gameIndex == 1) {
    playGame1Button.style.display = "inline";
    playGame2Button.style.display = "none";
  } else if (gameObject.gameIndex == 2) {
    playGame1Button.style.display = "none";
    playGame2Button.style.display = "inline";
  }
}

//Render player's controls based on chosen location in instructions and game screens
function renderPlayerControls(playerObject, displayLocation) {
  displayLocation.innerHTML = `${playerObject.displayName} controls:`;
  for (let i = 0; i < playerObject.controls.length; i++) {
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
    if (playerObject.controls[i] === "ArrowDown") {
      newBlock.innerText = "↓";
    } else if (playerObject.controls[i] === "ArrowLeft") {
      newBlock.innerText = "←";
    } else if (playerObject.controls[i] === "ArrowRight") {
      newBlock.innerText = "→";
    } else {
      newBlock.innerText = playerObject.controls[i].charAt(3);
    }

    displayLocation.append(newBlock);
  }
}

function renderGameEndPage(winnerName) {
  gamePage.style.display = "none";
  gameEndPage.style.display = "block";
  document.querySelector(".winning-player").innerText = `WINNER: ${winnerName}`; //Display winner
  game1WinnerScore = gameTimer / 100;
  document.querySelector("#player-1-win-count").innerHTML = players[0].winCount; //Display scores
  document.querySelector("#player-2-win-count").innerHTML = players[1].winCount;
}

/*----- Game 1 functions -----*/

//Start game 1 when player clicks "Start" after viewing instructions
function startGame1() {
  renderGame1();
  playGame1();
}

//Functions to render game board
function renderGame1() {
  instructionPage.style.display = "none"; //hide current page
  gamePage.style.display = "block"; //render game page
  players.forEach((player) => (player.gameScreen.innerHTML = ""));
  renderStack(generateRandomStack(stackHeight), players); //Randomly generate and display blocks

  //Render footer
  renderPlayerControls(players[0], gameScreenPlayer1ControlDisplay);
  renderPlayerControls(players[1], gameScreenPlayer2ControlDisplay);
}
//Generate random array of numbers to represent random stack of blocks. Follows stack height config
function generateRandomStack(stackHeight) {
  let randomArray = [];
  for (let i = 0; i < stackHeight; i++) {
    randomArray[i] = Math.floor(Math.random() * 3);
  }
  return randomArray;
}

//Render blocks based on random array and append to player's screen
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

//Game play. Detect player keystrokes and clear blocks
function playGame1() {
  gameTimer = 0;
  gameInterval = setInterval(incrementTimer, 10);
  function incrementTimer() {
    gameTimer++;
    timerDisplay = gameTimer / 100;
    gameTimerDisplay.forEach((timer) => {
      //display timer to 2 decimal points
      timer.innerHTML = timerDisplay.toFixed(2);
    });
  }
  document.addEventListener("keydown", clearBlocks); //clear blocks if player enters right key
  document.addEventListener("keydown", checkForGame1Win); //check whether player won
}

//Clear blocks based on players' input
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

function checkForGame1Win() {
  let winner = "";
  if (
    players[0].gameScreen.innerHTML === "" ||
    players[1].gameScreen.innerHTML === ""
  ) {
    clearInterval(gameInterval);
    gameOverSound.play();
    document.removeEventListener("keydown", clearBlocks);
    document.removeEventListener("keydown", checkForGame1Win);
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

/*----- Game 2 functions -----*/

//Start game 2 when player clicks "Start game 2"
function startGame2() {
  player1Game2Score = 0;
  player2Game2Score = 0;
  renderGame2();
  document.addEventListener("keydown", startNewOrder); //Start new round until one player wins 3 rounds
  document.addEventListener("keydown", checkforGame2Win); //Game ends when one player wins 3 rounds
}

//Render game 2
function renderGame2() {
  instructionPage.style.display = "none"; //hide current page
  gamePage.style.display = "block"; //render game page
  document.querySelector(".gamepage-title").innerText = games[1].title; //render game title

  //Render game instructions
  document.querySelector(".gamepage-instructions").innerText =
    "Press Space to start new order";

  //render new game screen
  players.forEach((player) => {
    player.gameScreen.innerHTML = ""; //clear previous screen
    player.gameScreen.setAttribute("class", "row player-gamescreen"); //render 3 columns on each player's screen
    player.gameScreen.innerHTML = `<div class="col-sm-4 player-gamescreen-col" id="${player.name}-col-0"></div>
    <div class="col-sm-4 player-gamescreen-col" id="${player.name}-col-1"></div>
    <div class="col-sm-4 player-gamescreen-col" id="${player.name}-col-2"></div>`;
  });
  //render footer
  player1ScoreDisplayBox.innerHTML = `Orders won:    <span id="player1-score">0</span><br /><br />`;
  player2ScoreDisplayBox.innerHTML = `Orders won:    <span id="player2-score">0</span><br /><br />`;
  renderPlayerControls(players[0], gameScreenPlayer1ControlDisplay);
  renderPlayerControls(players[1], gameScreenPlayer2ControlDisplay);
}

//Start new round when players press space bar
function startNewOrder(e) {
  if (e.code === "Space") {
    //Reset screen
    players.forEach((player) => {
      player.gameScreen.innerHTML = ""; //clear previous screen
      player.gameScreen.setAttribute("class", "row player-gamescreen"); //render 3 columns on each player's screen
      player.gameScreen.innerHTML = `<div class="col-sm-4 player-gamescreen-col" id="${player.name}-col-0"></div>
      <div class="col-sm-4 player-gamescreen-col" id="${player.name}-col-1"></div>
      <div class="col-sm-4 player-gamescreen-col" id="${player.name}-col-2"></div>`;
    });
    //Reset order array
    orderArray = generateOrderArray(maxOrderPerItem); //Generate order array - generate array of 3 random numbers
    renderOrder(orderArray); //Render pending orders on game screen
    //Reset player input arrays
    player1Game2Input = [null, null, null];
    player2Game2Input = [null, null, null];

    document.addEventListener("keydown", serveItem); //record player's keys
    document.addEventListener("keydown", checkOrder); //check whether player served right order
  }
}

//Generate array of random numbers to represent pending orders. Each item adheres to max order config
function generateOrderArray(maxOrderPerItem) {
  let randomArray = [];
  for (let i = 0; i < 3; i++) {
    randomArray[i] = Math.ceil(Math.random() * maxOrderPerItem);
  }
  return randomArray;
}

//Render pending orders on players's screen based on array of random numbers
function renderOrder(orderArray) {
  players.forEach((player) => {
    for (let i = 0; i < orderArray.length; i++) {
      const playerScreenCol = player.gameScreen.children[i];
      for (let j = 0; j < orderArray[i]; j++) {
        const newPendingOrderItem = document.createElement("div");
        newPendingOrderItem.setAttribute("class", "pending-order");
        newPendingOrderItem.setAttribute("value", i); //assign index as item value

        if (i == 0) {
          //style item based on index
          newPendingOrderItem.style.borderColor = "red";
        } else if (i == 1) {
          newPendingOrderItem.style.borderColor = "green";
        } else {
          newPendingOrderItem.style.borderColor = "blue";
        }
        playerScreenCol.append(newPendingOrderItem);
      }
    }
  });
}

//Log players' inputs and update UI
function serveItem(e) {
  if (players[0].controls.includes(e.code)) {
    //detect valid key input from player 1
    player1SuccessSound.play();
    if (players[0].controls.indexOf(e.code) == 0) {
      //If valid, add input to array
      player1Game2Input[0] = player1Game2Input[0] + 1;

      //replace pending items with served items
      //toast
      document.querySelector("#player1-col-0").children[0].remove();
      const servedToast = document.createElement("div");
      servedToast.setAttribute("class", "game-2-item-container");
      const toastIcon = document.createElement("img");
      toastIcon.setAttribute("src", "./Assets/toast.png");
      toastIcon.setAttribute("class", "game-2-item");
      servedToast.append(toastIcon);
      document.querySelector("#player1-col-0").append(servedToast);
    } else if (players[0].controls.indexOf(e.code) == 1) {
      player1Game2Input[1] = player1Game2Input[1] + 1;
      //coffee
      document.querySelector("#player1-col-1").children[0].remove();
      const servedCoffee = document.createElement("div");
      servedCoffee.setAttribute("class", "game-2-item-container");
      const coffeeIcon = document.createElement("img");
      coffeeIcon.setAttribute("src", "./Assets/coffee.png");
      coffeeIcon.setAttribute("class", "game-2-item");
      servedCoffee.append(coffeeIcon);
      document.querySelector("#player1-col-1").append(servedCoffee);
    } else if (players[0].controls.indexOf(e.code) == 2) {
      player1Game2Input[2] = player1Game2Input[2] + 1;
      //eggs
      document.querySelector("#player1-col-2").children[0].remove();
      const servedEggs = document.createElement("div");
      servedEggs.setAttribute("class", "game-2-item-container");
      const eggsIcon = document.createElement("img");
      eggsIcon.setAttribute("src", "./Assets/eggs.png");
      eggsIcon.setAttribute("class", "game-2-item");
      servedEggs.append(eggsIcon);
      document.querySelector("#player1-col-2").append(servedEggs);
    }
  } else if (players[1].controls.includes(e.code)) {
    //detect valid key input from player 2
    player2SuccessSound.play();
    if (players[1].controls.indexOf(e.code) == 0) {
      player2Game2Input[0] = player2Game2Input[0] + 1;
      document.querySelector("#player2-col-0").children[0].remove();
      const servedToast = document.createElement("div");
      servedToast.setAttribute("class", "game-2-item-container");
      const toastIcon = document.createElement("img");
      toastIcon.setAttribute("src", "./Assets/toast.png");
      toastIcon.setAttribute("class", "game-2-item");
      servedToast.append(toastIcon);
      document.querySelector("#player2-col-0").append(servedToast);
    } else if (players[1].controls.indexOf(e.code) == 1) {
      player2Game2Input[1] = player2Game2Input[1] + 1;
      document.querySelector("#player2-col-1").children[0].remove();
      const servedCoffee = document.createElement("div");
      servedCoffee.setAttribute("class", "game-2-item-container");
      const coffeeIcon = document.createElement("img");
      coffeeIcon.setAttribute("src", "./Assets/coffee.png");
      coffeeIcon.setAttribute("class", "game-2-item");
      servedCoffee.append(coffeeIcon);
      document.querySelector("#player2-col-1").append(servedCoffee);
    } else if (players[1].controls.indexOf(e.code) == 2) {
      player2Game2Input[2] = player2Game2Input[2] + 1;
      document.querySelector("#player2-col-2").children[0].remove();
      const servedEggs = document.createElement("div");
      servedEggs.setAttribute("class", "game-2-item-container");
      const eggsIcon = document.createElement("img");
      eggsIcon.setAttribute("src", "./Assets/eggs.png");
      eggsIcon.setAttribute("class", "game-2-item");
      servedEggs.append(eggsIcon);
      document.querySelector("#player2-col-2").append(servedEggs);
    }
  } else {
    return;
  }
}

//Check whether any player fulfilled order
function checkOrder(e) {
  if (
    players[0].controls.includes(e.code) ||
    players[1].controls.includes(e.code)
  ) {
    if (compareArrays(orderArray, player1Game2Input)) {
      orderSuccessSound.play();
      player1Game2Score++;
      document.querySelector("#player1-score").innerText = player1Game2Score;
    } else if (compareArrays(orderArray, player2Game2Input)) {
      orderSuccessSound.play();
      player2Game2Score++;
      document.querySelector("#player2-score").innerText = player2Game2Score;
    }
  }
}

function compareArrays(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function checkforGame2Win() {
  //Game ends when one player wins 3 times
  if (player1Game2Score == 3 || player2Game2Score == 3) {
    //end game
    gameOverSound.play();
    document.removeEventListener("keydown", checkforGame2Win);
    //update winner
    if (player1Game2Score == 3) {
      winner = players[0];
      players[0].winCount = players[0].winCount + 1;
      renderGameEndPage(players[0].displayName);
      nextGameButton.style.display = "none";
    } else {
      winner = players[1];
      players[1].winCount = players[1].winCount + 1;
      renderGameEndPage(players[1].displayName);
      nextGameButton.style.display = "none";
    }
  }
}

/*----- main function -----*/
init();
