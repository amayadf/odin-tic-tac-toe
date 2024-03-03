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

const game = (function() {
    
});