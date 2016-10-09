// assign a state to a table cell
        var assignState = function(state, limit) {

            var coordinates = [];

            for (var i=1; i<=noOfMines; i++) {

                var x = getRandomNumber(config.columns);
                var y = getRandomNumber(config.rows);

                gameStatus.board[x][y] = state;

                coordinates.push([x, y])

            }

            return coordinates;

        }

        var cellPositionsToCheck = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            // [0, 0] // this is the mine
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1]
        ];

        var getSurroundingCells = function(sourceCells) {

            var cellsToCheck = []

            sourceCells.forEach(function(sourceCell, index) {
                
                var x = sourceCell[0];
                var y = sourceCell[1];
                
                cellPositionsToCheck.forEach(function(cell, index) {
                    var xToCheck = x + cell[0];
                    var yToCheck = y + cell[1];
                    if (xToCheck > -1 && xToCheck < config.columns && yToCheck > -1 && yToCheck < config.rows) {
                        cellsToCheck.push([xToCheck, yToCheck]);
                    }
                })

            });

            return cellsToCheck;

        }

        var assignIndicators = function(mines) {

            var indicativeCells = getSurroundingCells(mines);

            indicativeCells.forEach(function(cell, index) {
                var x = cell[0];
                var y = cell[1];
                if (gameStatus.board[x][y] !== 'mine') {
                
                    // check surrounding cells for other mines
                    var surroundingCells = getSurroundingCells([[x, y]]);
                    var mineCount = 0;
                    var classText = '';

                    surroundingCells.forEach(function(surroundingCell, index) {
                        if (gameStatus.board[surroundingCell[0]][surroundingCell[1]] === 'mine') {
                            mineCount++;
                        }
                    });

                    switch (mineCount) {
                        case 8:
                            classText = 'next-to-eight-mines';
                            break;
                        case 7:
                            classText = 'next-to-seven-mines';
                            break;
                        case 6:
                            classText = 'next-to-six-mines';
                            break;
                        case 5:
                            classText = 'next-to-five-mines';
                            break;
                        case 4:
                            classText = 'next-to-four-mines';
                            break;
                        case 3:
                            classText = 'next-to-three-mines';
                            break;
                        case 2:
                            classText = 'next-to-two-mines';
                            break;
                        case 1:
                        default:
                            classText = 'next-to-one-mine';
                            break;
                    }

                    // assign state
                    gameStatus.board[x][y] = classText;
                }
                
                // set state / indicator
            })
        };

        var assignEvents = function() {
            
            // disable showing the context menu with a right click
            gameTable.addEventListener('contextmenu', function(event) {
                event.preventDefault();
                if (!joose.utils.hasClass(event.target, 'covered')) return false;
                switch (true) {
                    
                    // marked as a mine
                    case (joose.utils.hasClass(event.target, 'mine-marked')):
                        joose.utils.removeClass(event.target, 'mine-marked');
                        joose.utils.addClass(event.target, 'mine-possibility');
                        break;

                    // marked as a mine possiblity
                    case (joose.utils.hasClass(event.target, 'mine-possibility')):
                        joose.utils.removeClass(event.target, 'mine-possibility');
                        break;

                    // unmarked
                    default:
                        joose.utils.addClass(event.target, 'mine-marked');

                }
                return false;
            });

            gameTable.addEventListener('click', function(event) {
                
                // show the selected tile; this is the only action for tiles with indicators
                joose.utils.removeClass(event.target, 'covered');
                
                // assign the class in the game board object (private)
                // TODO

                // get the position in game board object
                var columns = event.target.parentNode.children;
                var column;
                var noOfColumns = columns.length;
                for (var i=1; i<noOfColumns; i++) {
                    if (columns[i] === event.target) {
                        column = i -1;
                    }
                }
                var rows = event.target.parentNode.parentNode.children;
                var row;
                var noOfRows = rows.length;
                for (var j=0; j<noOfRows; j++) {
                    if (rows[j] === event.target.parentNode) {
                        row = j;
                    }
                }

                switch (gameStatus.board[row][column]) {

                    // if the tile selected is a mine, end the game
                    case 'mine':
                        joose.utils.addClass(document.querySelector('tr:nth-child(' + (row + 1) + ') td:nth-child(' + (column + 2) + ')'), 'mine-triggered');
                        gameOver(false);
                        break;

                    case 'empty':
                        uncoverSurroundingCells(column, row);
                        break;

                    default:
                        // no other action needed, the tile is already uncovered
                        break;
                }
                
            });
        };

        var uncoverSurroundingCells = function(x, y) {
            
            // get surrounding cells
            var selectedCellSurroundingCells = getSurroundingCells([[x,y]])

            // if empty uncover too and get surrounding cells
            selectedCellSurroundingCells.forEach(function(cell) {
                if (gameStatus.board[cell[1]][cell[0]] !== 'mine') {
                    joose.utils.removeClass(document.querySelector('tr:nth-child(' + (cell[1] + 1) + ') td:nth-child(' + (cell[0] + 2) + ')'), 'covered')
                    /*if (gameStatus.board[cell[1]][cell[0]] === 'empty') {
                        uncoverSurroundingCells(cell[0], cell[1])
                    }*/
                }
            });

        }

        var gameOver = function(safe) {
            if (safe) {
                // show defused mines
            } else {
                joose.utils.addClass(document.querySelector('.health-status button'), 'dead');
            }
        };