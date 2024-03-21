function createPlayer(mark) {
    function getMark() {
        return mark;
    }

    return {
        getMark,
    }
}

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
        let roundResult = 'unavailable';
        if(gameBoard.placeMark(index, currentPlayer.getMark())) {
            if(checkForWin(index)) {
                gameBoard.clearGameBoard();
                roundResult = 'win';
            }
            else if(checkForTie()) {
                gameBoard.clearGameBoard();
                roundResult = 'tie';
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
        currentPlayer = playerO;
    }

    function getCurrentPlayerMark() {
        return currentPlayer.getMark();
    }

    return {
        playRound,
        restartGame,
        getCurrentPlayerMark,
    }
})();

const displayController = (function() {
    const cells = document.querySelectorAll('.game-board__cell');
    const points = document.querySelectorAll('.points-info__amount');
    const turnMessage = document.querySelector('.messages__turn-display');
    const turnMessageSpan = document.querySelector('.messages__turn-display span')
    const outcomeMessage = document.querySelector('.messages__round-outcome');
    const outcomeMessageSpan = document.querySelector('.messages__round-outcome span');
    const restartBtn = document.querySelector('.main__restart-btn');

    let playerXPoints = 0, playerOPoints = 0, ties = 0;

    function addEvents() {
        restartBtn.addEventListener('click', () => {
            gameController.restartGame();
            resetPoints();
            updatePointsInfo();
            turnMessageSpan.textContent = gameController.getCurrentPlayerMark();
            turnMessageSpan.classList.remove('X');
            turnMessageSpan.classList.add('O');
            outcomeMessage.classList.add('hidden');
            turnMessage.classList.remove('hidden');
            updateGameBoard();
        });

        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', (e) => {
                let currentMark = gameController.getCurrentPlayerMark();
                let roundResult = gameController.playRound(i);
                if(roundResult !== 'unavailable') {
                    cells[i].textContent = currentMark;
                    if(roundResult !== 'unfinished') {
                        if(roundResult === 'win') {
                            if(currentMark === 'X') {
                                playerXPoints++;
                                outcomeMessageSpan.classList.remove('O');
                                outcomeMessageSpan.classList.add('X');
                                outcomeMessageSpan.textContent = 'Player X wins!';
                            }
                            else {
                                playerOPoints++;
                                outcomeMessageSpan.classList.add('O');
                                outcomeMessageSpan.classList.remove('X');
                                outcomeMessageSpan.textContent = 'Player O wins!';
                            }
                        }
                        else if(roundResult === 'tie') {
                            ties++;
                            outcomeMessageSpan.classList.remove('O');
                            outcomeMessageSpan.classList.remove('X');
                            outcomeMessageSpan.textContent = "It's a tie!";
                        }
                        updatePointsInfo();
                        turnMessage.classList.add('hidden');
                        outcomeMessage.classList.remove('hidden');
    
                        e.stopPropagation();
    
                        document.body.addEventListener('click', () => {
                            updateGameBoard();
                            turnMessage.classList.remove('hidden');
                            outcomeMessage.classList.add('hidden');
                        });
                    }
                    else {
                        turnMessageSpan.textContent = gameController.getCurrentPlayerMark();
                        turnMessageSpan.classList.toggle('X');
                        turnMessageSpan.classList.toggle('O');
                    } 
                }
            });
        }
    }

    function resetPoints() {
        playerOPoints = 0;
        ties = 0;
        playerXPoints = 0;
    }

    function updatePointsInfo() {
        points[0].textContent = playerOPoints;
        points[1].textContent = ties;
        points[2].textContent = playerXPoints;
    }

    function handleMouseOver(e) {
        e.target.textContent = gameController.getCurrentPlayerMark();
    }

    function handleMouseOut(e) {
        e.target.textContent = '';
    }

    function updateGameBoard() {
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = gameBoard.getMarkAtIndex(i);
        }
    }

    return { addEvents };
})();

displayController.addEvents();
