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

    return {
        getName,
        getMark,
        getPoints,
        addPoint,
    }
}

const gameController = (function() {
    let players = [];
    const marks = ['O', 'X'];

    function setPlayers(names, marks) {
        players.push(createPlayer(names[0], marks[0]));
        players.push(createPlayer(names[1], marks[1]));
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

    function checkForWinner() {

    }

    function playRound() {

    }



});