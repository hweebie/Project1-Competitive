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
  {
    gameIndex: 1,
    title: "JUST WHACK ONLY",
    imgHTML: "Image goes here",
    text: "instructions!",
  }, //TODO: update game 1 instructions
  {
    gameIndex: 2,
    title: "KOPITIAM HERO",
    imgHTML: "Image goes here",
    text: "Press the buttons to match each order. <br/><br/>Too many items will spoil your job.<br/><br/><strong>Compete for time! Get 3 points to win.</strong>",
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
const player1ScoreDisplayBox = document.querySelector(".player1-score-display");
const player2ScoreDisplayBox = document.querySelector(".player2-score-display");
const gamePage = document.querySelector(".gamepage");
const instructionPage = document.querySelector(".instructionpage");
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
  { name: "Desmond", score: 1 },
  { name: "Lian Kai", score: 1 },
  { name: "Chicken", score: 1 },
];
let game1WinnerScore = 0;
let highScoreNameInput = "";

//Game 2 variables
const maxOrderPerItem = 4;
const maxGame2Rounds = 6;
let player1Game2Score = 0;
let player2Game2Score = 0;
let orderArray = [];
let player1Game2Input = [null, null, null];
let player2Game2Input = [null, null, null];
function compareArrays(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

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

/*----- event listeners -----*/

highScoreButton.addEventListener("click", renderHighScorePage);
homeButton.addEventListener("click", renderHomepage);
startButton.addEventListener("click", renderGame2Instructions); //TODO: REVERT TO GAME 1 WHEN READY
playGame1Button.addEventListener("click", startGame1);
gameEndHomeButton.addEventListener("click", loadHomepage);
replayGame1Button.addEventListener("click", replayGame1);
nextGameButton.addEventListener("click", renderGame2Instructions);

/*----- Game functions -----*/

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

/*----- Game 1 functions -----*/

//Render game instructions. Triggered by player clicking "Start"
function renderGame1Instructions() {
  homepage.style.display = "none"; //hide homepage
  instructionPage.style.display = "block"; //render instructions page
  renderPlayerControls(
    players[0].controls,
    instructionPagePlayer1ControlDisplay
  );
  renderPlayerControls(
    players[1].controls,
    instructionPagePlayer2ControlDisplay
  );
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

//Start game 1 when player clicks "Start" after viewing instructions
function startGame1() {
  renderGame1();
  playGame1();
}

//Functions to render game 1 board
function renderGame1() {
  instructionPage.style.display = "none"; //hide current page
  gamePage.style.display = "block"; //render game page
  players.forEach((player) => (player.gameScreen.innerHTML = ""));
  renderStack(generateRandomStack(stackHeight), players); //Randomly generate and display blocks

  //Render footer
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
    nextGameButton.style.visibility("visible");
    checkHighScore(winner, game1WinnerScore, highScores);
  }
}

function renderGameEndPage(winnerName) {
  gamePage.style.display = "none";
  game1EndPage.style.display = "block";

  //Display winner
  document.querySelector(".winning-player").innerText = `WINNER: ${winnerName}`;

  //Display scores
  // game1WinnerScore = gameTimer / 100;
  // document.querySelector(
  //   ".game-score-display"
  // ).innerHTML = `Winner's Score: ${game1WinnerScore.toFixed(2)} secs`;
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
  instructionPage.style.display = "block";
}

/*----- Game 2 functions -----*/

function renderGame2Instructions() {
  //Update page with Game 2 instructions
  homepage.style.display = "none"; //revert to game 1 end page when game done
  //game1EndPage.style.display = "none";
  instructionPage.style.display = "block";
  document.querySelector(".instructions-title").innerText =
    gameInstructions[1].title;
  document.querySelector(".instructions-screenshot").innerHTML =
    gameInstructions[1].imgHTML;
  document.querySelector(".instructions-text").innerHTML =
    gameInstructions[1].text;

  //render player controls
  renderPlayerControls(
    players[0].controls,
    instructionPagePlayer1ControlDisplay
  );
  renderPlayerControls(
    players[1].controls,
    instructionPagePlayer2ControlDisplay
  );
  //remove game 1 start button, create and append game 2 start button
  playGame1Button.remove();
  let startGame2Button = document.createElement("button");
  startGame2Button.innerText = "Start!";
  startGame2Button.setAttribute("class", "btn btn-danger");
  startGame2Button.setAttribute("id", "playgame2");
  instructionPage.appendChild(startGame2Button);
  startGame2Button.addEventListener("click", startGame2);
}

//Start game 1 when player clicks "Start" after viewing instructions
function startGame2() {
  renderGame2();
  //if no one has won 3 rounds, play another round
  document.addEventListener("keydown", startNewOrder);
  document.addEventListener("keydown", checkforGame2Win);
}

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

//Render game 2 board
function renderGame2() {
  instructionPage.style.display = "none"; //hide current page
  gamePage.style.display = "block"; //render game page
  document.querySelector(".gamepage-title").innerText =
    gameInstructions[1].title; //render game title

  //Render game instructions
  let game2Instruction = document.createElement("p");
  game2Instruction.innerText = "Press Space to start new order";
  document.querySelector(".game-body").prepend(game2Instruction);
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
  renderPlayerControls(players[0].controls, gameScreenPlayer1ControlDisplay);
  renderPlayerControls(players[1].controls, gameScreenPlayer2ControlDisplay);
}

function serveItem(e) {
  if (players[0].controls.includes(e.code)) {
    //detect valid key input from player 1
    player1SuccessSound.play();
    if (players[0].controls.indexOf(e.code) == 0) {
      //If valid, add input to array
      //TODO: render order on UI
      player1Game2Input[0] = player1Game2Input[0] + 1;

      //replace pending toast with toast
      document.querySelector("#player1-col-0").children[0].remove(); //remove last element
      const servedToast = document.createElement("div"); //create new coffee element and append
      servedToast.setAttribute("class", "game-2-item-container");
      const toastIcon = document.createElement("img");
      toastIcon.setAttribute("src", "./Assets/toast.png");
      toastIcon.setAttribute("class", "game-2-item");
      servedToast.append(toastIcon);
      document.querySelector("#player1-col-0").append(servedToast);
    } else if (players[0].controls.indexOf(e.code) == 1) {
      player1Game2Input[1] = player1Game2Input[1] + 1;

      //replace pending coffee with coffee
      document.querySelector("#player1-col-1").children[0].remove(); //remove last element
      const servedCoffee = document.createElement("div"); //create new coffee element and append
      servedCoffee.setAttribute("class", "game-2-item-container");
      const coffeeIcon = document.createElement("img");
      coffeeIcon.setAttribute("src", "./Assets/coffee.png");
      coffeeIcon.setAttribute("class", "game-2-item");
      servedCoffee.append(coffeeIcon);
      document.querySelector("#player1-col-1").append(servedCoffee);
      //BUG: doesn't show beyond pending items
    } else if (players[0].controls.indexOf(e.code) == 2) {
      player1Game2Input[2] = player1Game2Input[2] + 1;
      //replace pending eggs with eggs
      document.querySelector("#player1-col-2").children[0].remove(); //remove last element
      const servedEggs = document.createElement("div"); //create new coffee element and append
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
      document.querySelector("#player2-col-0").children[0].remove(); //remove last element
      const servedToast = document.createElement("div"); //create new coffee element and append
      servedToast.setAttribute("class", "game-2-item-container");
      const toastIcon = document.createElement("img");
      toastIcon.setAttribute("src", "./Assets/toast.png");
      toastIcon.setAttribute("class", "game-2-item");
      servedToast.append(toastIcon);
      document.querySelector("#player2-col-0").append(servedToast);
    } else if (players[1].controls.indexOf(e.code) == 1) {
      player2Game2Input[1] = player2Game2Input[1] + 1;
      document.querySelector("#player2-col-1").children[0].remove(); //remove last element
      const servedCoffee = document.createElement("div"); //create new coffee element and append
      servedCoffee.setAttribute("class", "game-2-item-container");
      const coffeeIcon = document.createElement("img");
      coffeeIcon.setAttribute("src", "./Assets/coffee.png");
      coffeeIcon.setAttribute("class", "game-2-item");
      servedCoffee.append(coffeeIcon);
      document.querySelector("#player2-col-1").append(servedCoffee);
      //BUG: doesn't show beyond pending items
    } else if (players[1].controls.indexOf(e.code) == 2) {
      player2Game2Input[2] = player2Game2Input[2] + 1;
      document.querySelector("#player2-col-2").children[0].remove(); //remove last element
      const servedEggs = document.createElement("div"); //create new coffee element and append
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

function checkOrder(e) {
  if (
    players[0].controls.includes(e.code) ||
    players[1].controls.includes(e.code)
  ) {
    if (compareArrays(orderArray, player1Game2Input)) {
      // game2Instruction.innerText =
      //   "Player 1 got this order! <br/><br/>Press Space to start new order";
      orderSuccessSound.play();
      player1Game2Score++;
      document.querySelector("#player1-score").innerText = player1Game2Score;
    } else if (compareArrays(orderArray, player2Game2Input)) {
      // game2Instruction.innerText =
      //   "Player 2 got this order! <br/><br/>Press Space to start new order";
      orderSuccessSound.play();
      player2Game2Score++;
      document.querySelector("#player2-score").innerText = player2Game2Score;
    }
  }
}

//generate array of random numbers
function generateOrderArray(maxOrderPerItem) {
  let randomArray = [];
  for (let i = 0; i < 3; i++) {
    randomArray[i] = Math.ceil(Math.random() * maxOrderPerItem);
  }
  return randomArray;
}

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

/*----- main function -----*/
init();
