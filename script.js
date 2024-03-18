const gameBoard = (function() {
    let boardArray = ['','','','','','','','',''];

    function getGameBoard() {
        return boardArray;
    }

    function getMarkAtIndex(index) {
        if(index < boardArray.length && index >= 0) {
            return boardArray[index];
        }
        return;
    }

    function checkIfAvailable(index) {
        return boardArray[index] === '';
    }

    function placeMark(index, mark) {
        if(checkIfAvailable(index)) {
            boardArray[index] = mark;
            return true;
        }
        return false;
    }

    function clearGameBoard() {
        boardArray.forEach((element,index) => {
            boardArray[index] = '';
        })
    }

    return {
        getGameBoard,
        getMarkAtIndex,
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
    let playerO = createPlayer('O');
    let playerX = createPlayer('X');
    let currentPlayer = playerO;

    function checkForTie() {
        return !(gameBoard.getGameBoard().includes(''));
    }

    function checkForWin(newMarkIndex) {
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
            .every((index) => gameBoard.getMarkAtIndex(index) === currentPlayer.getMark()));
    }

    function changePlayer() {
        currentPlayer === playerO ? currentPlayer = playerX : currentPlayer = playerO;
    }

    function playRound(index) {
        if(gameBoard.placeMark(index, currentPlayer.getMark())) {
            if(checkForTie()) {
                currentPlayer = playerO;
                gameBoard.clearGameBoard();
            } 
            else if(checkForWin(index)) {
                currentPlayer.addPoint();
                gameBoard.clearGameBoard();
            }
            else {
                changePlayer();
            }
        }
    }

    function restartGame() {
        gameBoard.clearGameBoard();
        playerO.resetPoints();
        playerX.resetPoints();
        currentPlayer = playerO;
    }

    return {
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