class TicTacToe {
    constructor(initPlayer, tableSize) {
        this.players = { X: "X", O: "O" };

        this.tttConfig = {
            board: this.createMatrix(tableSize, tableSize),
            winner: null,
            gameOver: false,
            player: this.players[initPlayer],
        };

        this.winning_combinations = [];

        this.positions = {};

        this.setPositions();
        this.setWinningCombinations();
    }

    setPositions() {
        for (let iRow = 0; iRow < this.tttConfig["board"].length; iRow++) {
            const row = this.tttConfig["board"][iRow];
            for (let iPos = 0; iPos < row.length; iPos++) {
                this.positions[parseInt(row[iPos])] = [iRow, iPos];
            }
        }
    }

    setWinningCombinations() {
        const boardLength = this.tttConfig["board"].length;

        // rectas (filas/columnas)
        for (let i = 0; i < boardLength; i++) {
            const row = [];
            const column = [];
            for (let j = 0; j < boardLength; j++) {
                row.push(parseInt(this.tttConfig["board"][i][j]));
                column.push(parseInt(this.tttConfig["board"][j][i]));
            }
            this.winning_combinations.push(row);
            this.winning_combinations.push(column);
        }

        // diagonales (superior-derecha - inferior-izquierda / superior-izquierda - inferior-derecha)
        let combination = [];
        let i = 0,
            j = 1;
        while (i < boardLength) {
            // izq
            combination.push(i * boardLength + j);
            i += 1;
            j += 1;
        }
        this.winning_combinations.push(combination);

        combination = [];
        (i = 0), (j = boardLength);
        while (i < boardLength) {
            // der
            combination.push(i * boardLength + j);
            i += 1;
            j -= 1;
        }
        this.winning_combinations.push(combination);
    }
    table = document.querySelector("#table");

    createMatrix(rows, columns) {
        const matriz = [];
        let acc = 0;
        for (let i = 0; i < rows; i++) {
            const row = [];

            const rowOfHTML = document.createElement("div");
            rowOfHTML.classList.add(i + 1, "row");
            for (let j = 0; j < columns; j++) {
                row.push(String(acc + 1));
                const element = document.createElement("button");

                element.textContent = "-";
                element.classList.add(acc + 1, "option");

                rowOfHTML.appendChild(element);
                acc += 1;
            }
            matriz.push(row);
            this.table.append(rowOfHTML);
        }
        return matriz;
    }

    getPos(p) {
        return this.tttConfig["board"][this.positions[p][0]][
            this.positions[p][1]
        ];
    }

    load() {
        document.querySelectorAll(".option").forEach((option) => {
            const pos = this.positions[option.classList[0]];
            option.addEventListener("click", (e) => {
                e.preventDefault();

                if(this.tttConfig.gameOver) return;

                const playerX = this.players["X"];
                const playerO = this.players["O"];
                console.log(this.tttConfig.player)

                if(this.getPos(option.classList[0]) === playerX || this.getPos(option.classList[0]) === playerO) {
                    return document.querySelector("#message").textContent = "invalid position";
                } else document.querySelector("#message").textContent = "";

                option.textContent = this.tttConfig.player === this.players.X ? this.players.X : this.players.O;
                
                this.tttConfig["board"][pos[0]][pos[1]] = this.tttConfig["player"] === playerX ? playerX : playerO;
                this.tttConfig["player"] = this.tttConfig["player"] === playerX ? playerO : playerX;

                if (
                    this.tttConfig["board"].every((row) =>
                        row.every((box) => box === playerX || box === playerO)
                    )
                ) {
                    this.tttConfig["gameOver"] = true;
                    this.tttConfig["winner"] = "tie";
                }

                if (
                    this.winning_combinations.some((winning_combination) =>
                        winning_combination.every(
                            (p) =>
                                this.getPos(winning_combination[0]) ===
                                this.getPos(p)
                        )
                    )
                ) {
                    this.tttConfig["winner"] =
                        this.tttConfig["player"] === playerO
                            ? playerX
                            : playerO;
                    this.tttConfig["gameOver"] = true;
                }

                if (this.tttConfig["gameOver"]) {
                    console.clear();

                    if (this.tttConfig["winner"] === "tie") {
                        document.querySelector("#message").textContent = "TIE";
                    } else {
                        document.querySelector("#message").textContent = `Game Over! ${this.tttConfig["winner"]} won!`;
                    }
                } 

                console.log(this.tttConfig);
            });
        });
    }
}

const tableSizeInput = document.getElementById("tableSize");
const validPlayers = ["X", "O"];

new TicTacToe(validPlayers[Math.floor(Math.random() * validPlayers.length)], tableSizeInput.value || 3).load();

tableSizeInput.addEventListener("change", newGame);
document.querySelector("#restart").addEventListener("click", newGame);

function newGame() {
    document.querySelector("#table").innerHTML = "";
    document.querySelector("#message").innerHTML = "";
    return new TicTacToe(validPlayers[Math.floor(Math.random() * validPlayers.length)], tableSizeInput.value || 3).load();
}