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
        let roundResult = 'unplaced';
        if(gameBoard.placeMark(index, currentPlayer.getMark())) {
            if(checkForTie()) {
                gameBoard.clearGameBoard();
                roundResult = 'tie';
            } 
            else if(checkForWin(index)) {
                currentPlayer.addPoint();
                gameBoard.clearGameBoard();
                roundResult = 'win';
            }
            else {
                changePlayer();
                roundResult = 'unfinished'
            }
        }
        return roundResult;
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
        getCurrentPlayerPoints,
    }
})();

const displayController = (function() {
    let cells = document.querySelectorAll('.cell');
    let playerOPoints = document.querySelector('#player-O-points');
    let playerXPoints = document.querySelector('#player-X-points');
    let restartButton = document.querySelector('#btn-restart');
    let turnMessage = document.querySelector('#turn-message')
    let currentPlayer = document.querySelector('#current-player');
    let gameMessage = document.querySelector('#game-message');
    let roundOutcome = document.querySelector('#round-outcome');

    function addEvents() {
        restartButton.addEventListener('click', () => {
            gameController.restartGame();
            playerOPoints.textContent = '0';
            playerXPoints.textContent = '0';
            cells.forEach((cell) => cell.textContent = '');
            turnMessage.classList.remove('hidden');
            gameMessage.classList.add('hidden');
            currentPlayer.textContent = gameController.getCurrentPlayerMark();
            currentPlayer.classList.remove('X');
            currentPlayer.classList.add('O');
        });

        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', (e) => {
                let currentMark = gameController.getCurrentPlayerMark();
                let roundResult = gameController.playRound(i);
                if(roundResult !== 'unplaced') {
                    cells[i].textContent = currentMark;
                    if(roundResult !== 'unfinished') {
                        if(roundResult === 'win') {
                            if(currentMark === 'X') {
                                playerXPoints.textContent = gameController.getCurrentPlayerPoints();
                                roundOutcome.classList.remove('O');
                                roundOutcome.classList.add('X');
                                roundOutcome.textContent = 'Player X wins!';
                            }
                            else {
                                playerOPoints.textContent = gameController.getCurrentPlayerPoints();
                                roundOutcome.classList.add('O');
                                roundOutcome.classList.remove('X');
                                roundOutcome.textContent = 'Player O wins!';
                            }
                        }
                        else if(roundResult === 'tie') {
                            roundOutcome.classList.remove('O');
                            roundOutcome.classList.remove('X');
                            roundOutcome.textContent = "It's a tie!";
                        }
                        turnMessage.classList.add('hidden');
                        gameMessage.classList.remove('hidden');
    
                        e.stopPropagation();
    
                        document.body.addEventListener('click', () => {
                            updateGameBoard();
                            turnMessage.classList.remove('hidden');
                            gameMessage.classList.add('hidden');
                        });
                    }
                    else {
                        currentPlayer.textContent = gameController.getCurrentPlayerMark();
                        currentPlayer.classList.toggle('X');
                        currentPlayer.classList.toggle('O');
                    } 
                }
            });
        }
    }

    function updateGameBoard() {
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = gameBoard.getMarkAtIndex(i);
        }
    }

    return { addEvents };
})();

displayController.addEvents();
