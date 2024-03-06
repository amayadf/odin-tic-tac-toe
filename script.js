const gameBoard = (function() {
    let gameBoardArray = 
    [['','','']
     ['','','']
     ['','','']];

    function getGameBoard() {
        return gameBoardArray;
    }

    function checkIfAvailable(x, y) {
        return gameBoardArray[x][y] === '';
    }

    function placeMark(x, y, mark) {
        if(checkIfAvailable(x, y)) {
            gameBoardArray[x][y] = mark;
            return true;
        }
        else {
            return false;
        }
    }

    function clearGameBoard() {
        gameBoardArray.forEach((row, rowIndex) => {
            row.forEach((cell,cellIndex) => {
                gameBoardArray[rowIndex][cellIndex] = '';
            });
        });
    }
    
    return {
        getGameBoard,
        checkIfAvailable,
        placeMark,
        clearGameBoard,
    }
});

function createPlayer(name, mark) {
    let points = 0;

    function getName() {
        return name;
    }

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
        getName,
        getMark,
        getPoints,
        addPoint,
        resetPoints
    }
}

//I will keep the game rules here since the board object could be ANY board
const gameController = (function() {
    let players = [];
    let currentPlayer;
    const marks = ['O', 'X'];

    function setPlayers(names, marks) {
        players.push(createPlayer(names[0], marks[0]));
        players.push(createPlayer(names[1], marks[1]));
        currentPlayer = players[0];
    }

    function checkForTie(array) {
        let tie = true;
        for(let i = 0; i < array.lenght && tie; i++){
            for(let j = 0; j < array[i].lenght && tie; j++) {
                if(row.includes('')) tie = false;   
            }
        }
        return tie;
    }

    function checkForWin(array) {
        let winner = false;

        //check horizontal
        for(let i = 0; i < array.lenght && !winner; i++) {
            if(allEqual(array[i])) winner = true;
        }

        //check vertical(
        for(let i = 0; i < array[0].lenght && !winner; i++) {
            if(allEqual(array[0][i], array[1][i], array[2][i])) winner = true;
        }

        //check diagonal
        if(!winner && allEqual(array[0][0], array[1][1], array[2][2])) winner = true;
        if(!winner && allEqual(array[2][0], array[1][1], array[0][2])) winner = true;

        return winner;
    }

    function playRound(x, y) {
        if(gameBoard.placeMark(x, y, currentPlayer.getMark())) {
            if(checkForWin(gameBoard.getGameBoard())) {
                currentPlayer.addPoint();
                gameBoard.clearGameBoard();
            }
            else if (checkForTie(gameBoard.getGameBoard())) {
                currentPlayer = players[0];
                gameBoard.clearGameBoard();
            }
            else {
                changePlayer();
            }
        }
    }

    function changePlayer() {
        currentPlayer == players[0] ? currentPlayer = players[1] : currentPlayer = players[1];
    }

    function restartGame() {
        gameBoard.clearGameBoard();
        players[0].resetPoints();
        players[1].resetPoints();
        currentPlayer = players[0];
    }
});