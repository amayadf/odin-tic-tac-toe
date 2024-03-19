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
})();

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
            return true;
        }
        return false;
    }

    function restartGame() {
        gameBoard.clearGameBoard();
        playerO.resetPoints();
        playerX.resetPoints();
        currentPlayer = playerO;
    }

    function getCurrentPlayerMark() {
        return currentPlayer.getMark();
    }

    function getCurrentPlayerPoints() {
        return currentPlayer.getPoints();
    }

    return {
        playRound,
        restartGame,
        getCurrentPlayerMark,
    }
})();

const displayController = (function() {
    let cells = document.querySelectorAll('.cell');
    let playerOPoints = document.querySelector('#player-O-points');
    let playerXPoints = document.querySelector('#player-X-points');
    let restartButton = document.querySelector('#btn-restart');

    function handleCellClick(e) {
        if(gameController.playRound(index)) {
            e.target.textContent = gameController.getCurrentPlayerMark();
            if(e.target.textContent === 'X') {
                playerXPoints.textContent = gameController.getCurrentPlayerPoints();
            }
            else {
                playerOPoints.textContent = gameController.getCurrentPlayerPoints();
            }
        }
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', () => {
            let round = gameController.playRound(i);
            if(round) {
                cells[i].textContent = gameController.getCurrentPlayerMark();
            }
            cells[i]
        });
    }

    function addEvents() {
        restartButton.addEventListener('click', () => {
            gameController.restartGame();
            playerOPoints.textContent = '0';
            playerXPoints.textContent = '0';
            cells.forEach((cell) => cell.textContent = '');
        });

    }

    return { addEvents };
})();

displayController.addEvents();
