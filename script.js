const gameBoard = (function() {
    let gameBoardArray = ['','','','','','','','',''];

    function getGameBoard() {
        return gameBoardArray;
    }

    function checkIfAvailable(index) {
        return gameBoardArray[index] === '';
    }

    function placeMark(index, mark) {
        if(checkIfAvailable(index)) {
            gameBoardArray[index] = mark;
            return true;
        }
        return false;
    }

    function clearGameBoard() {
        gameBoardArray.forEach((element,elementIndex) => {
            gameBoardArray[elementIndex] = '';
        })
    }

    return {
        getGameBoard,
        checkIfAvailable,
        placeMark,
        clearGameBoard
    }
})

function createPlayer(mark) {
    let points = 0;

    function getMark() {
        return mark;
    }

    function getPoints() {
        return points;
    }

    function addPoint() {
        points++;
    }

    function resetPoints() {
        points = 0;
    }

    return {
        getMark,
        getPoints,
        addPoint,
        resetPoints
    }
}

const gameController = (function() {
    let players = [createPlayer('O'), createPlayer('X')];
    let currentPlayerIndex = 0;

    function checkForTie() {
        return !gameBoard.getGameBoard().includes('');
    }

    function checkWinner(newMarkIndex) {
        const winConditions = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];

        return winConditions
                .filter((condition) => condition
                .includes(newMarkIndex)).some((possibleCondition) => possibleCondition
                .every((index) => gameBoard.getGameBoard()[index] === players[currentPlayerIndex].getMark()));
    }

    function playRound(index) {
        if(gameBoard.placeMark(index, players[currentPlayerIndex].getMark())) {
            if(checkForTie()) {
                currentPlayerIndex = 0;
                gameBoard.clearGameBoard();
            }
            else if(checkWinner(index).lenght > 0) {
                players[currentPlayerIndex].addPoint();
                gameBoard,clearGameBoard();
            }
            else {
                changePlayer();
            }
        }
    }
    
    function changePlayer() {
        currentPlayerIndex === 0 ? currentPlayerIndex = 1 : currentPlayerIndex = 0;
    }

    function restartGame() {
        gameBoard.clearGameBoard();
        players[0].resetPoints();
        players[1].resetPoints();
        currentPlayerIndex = 0;
    }

    return {
        players,
        currentPlayerIndex,
        playRound,
        restartGame
    }
});

const displayController = (function() {
    let gameBoardCells = document.querySelectorAll('.cell');
    let btnRestart = document.querySelector('#btn-restart');
    let playerOnePoints = document.querySelector('#player-1-points')
    let playerTwoPoints = document.querySelector('#player-2-points');

    btnRestart.addEventListener('click', () => {
        gameController.restartGame();
        playerOnePoints.textContent = '0';
        playerTwoPoints.textContent = '0';
        gameBoardCells.forEach(cell => cell.textContent = '');
    });

    gameBoardCells.forEach(cell => cell.addEventListener('click', () => {
        const index = gameBoardCells.indexOf(cell);
        gameController.playRound(index);
        cell.textContent = gameController.players[currentPlayerIndex].getMark();
        playerOnePoints.textContent = gameController.players[0].getPoints();
        playerTwoPoints.textContent = gameController.players[1].getPoints();
    }));
})