

alert("CROSS THE GRID!\n\nThere is a grid in front of you which contains food in some places and bombs in some places. You will be shown the locations of food, bombs for some time.\n\nYour objective is to remember as many locations as possible so that you can find more food, step on less bombs and cross the grid area without losing all your lives.\n\nWhat are you waiting for? Let's Start!");

var grid, game;
var grid_x, grid_y;

var curr_x, curr_y;
var lives, score;

function newGame() {
    document.getElementById("mygrid").style.display = "none";
    document.getElementById("startGame").style.display = "none";
    var grid_size = document.getElementById("mygrid").value;
    grid = [];
    for (var x = 0; x < grid_size; x++) {
        grid[x] = [];
        for (var y = 0; y < grid_size; y++)
            grid[x][y] = "";
        var b = Math.floor(Math.random() * grid_size), c;
        grid[x][b] = "&#128163;";
        do {
            c = Math.floor(Math.random() * grid_size);
        } while (c === b);
        grid[x][c] = "&#127828;";
    }
    var a = Math.floor(Math.random() * grid_size);
    grid[grid_size] = [];
    for (var z = 0; z < grid_size; z++)
        if (z !== a)
            grid[grid_size][z] = "";
        else
            grid[grid_size][z] = "&#128694;";
    game = grid;
    grid_x = game.length;
    grid_y = game.length - 1;
    curr_x = grid_x - 1;
    curr_y = a;
    startGame(grid_size);
}

function startGame(grid_size) {
    lives = 5;
    score = 0;
    document.getElementById("lives").innerHTML = "&#10084;&#10084;&#10084;&#10084;&#10084;";
    document.getElementById("score").innerHTML = "<i>Score</i>: <b>0</b>";
    document.getElementById("status").style.display = "block";
    drawGrid();
    setTimeout(function() {
        for (var i = 0; i < grid_x - 1; i++)
            for (var j = 0; j < grid_y; j++)
                document.getElementById("cell_" + i + "_" + j).innerHTML = "";
        document.getElementById("controls").style.display = "block";
    }, 500 * grid_size);
}

function drawGrid() {
    var table = document.getElementById("grid");
    table.innerHTML = "";
    table.createCaption().innerHTML = "<b>------ EXIT ------</b>";
    var i, j, rows = [], cols = [];
    for (i = 0; i < grid_x; i++) {
        rows[i] = table.insertRow(i);
        for (j = 0; j < grid_y; j++) {
            cols[j] = rows[i].insertCell(j);
            cols[j].id = "cell_" + i + "_" + j;
            cols[j].innerHTML = game[i][j];
            if (i === grid_x - 1)
                cols[j].style.backgroundColor = "purple";
        }
    }
}

function up() {
    if (curr_x === 0) {
        alert("You succesfully crossed the grid!\nArea Covered + Food: " + score + "\nLives Remaining: " + lives + " (x" + (grid.length * 5 + 5) + ")\nTotal Score: " + (score + lives * (grid.length * 5 + 5)) + "\nCongrats!");
        document.getElementById("mygrid").style.display = "inline";
        document.getElementById("startGame").style.display = "block";
        document.getElementById("grid").innerHTML = "";
        document.getElementById("status").style.display = "none";
        document.getElementById("controls").style.display = "none";
    } else {
        document.getElementById("cell_" + curr_x + "_" + curr_y).innerHTML = "";
        curr_x--;
        changeGrid();
    }
}

function left() {
    if (curr_y !== 0) {
        document.getElementById("cell_" + curr_x + "_" + curr_y).innerHTML = "";
        curr_y--;
        changeGrid();
    }
}

function down() {
    if (curr_x < grid_x - 1) {
        document.getElementById("cell_" + curr_x + "_" + curr_y).innerHTML = "";
        curr_x++;
        changeGrid();
    }
}

function right() {
    if (curr_y < grid_y - 1) {
        document.getElementById("cell_" + curr_x + "_" + curr_y).innerHTML = "";
        curr_y++;
        changeGrid();
    }
}

function changeGrid() {
    var curr = document.getElementById("cell_" + curr_x + "_" + curr_y);
    if (game[curr_x][curr_y] === "&#128163;" && curr.style.backgroundColor !== "red") {
        var left = --lives, remaining = "";
        while (left > 0) {
            remaining += "&#10084;";
            left--;
        }
        document.getElementById("lives").innerHTML = remaining;
        if (lives === 0) {
            alert("You lost all your lives! Game Over!");
            document.getElementById("mygrid").style.display = "inline";
            document.getElementById("startGame").style.display = "block";
            document.getElementById("grid").innerHTML = "";
            document.getElementById("status").style.display = "none";
            document.getElementById("controls").style.display = "none";
        } else {
            alert("Ouch! You stepped on a BOMB!!");
            curr.style.backgroundColor = "red";
        }
    } else if (game[curr_x][curr_y] === "&#127828;" && curr.style.backgroundColor !== "green") {
        score += grid.length < 8 ? 25 : 35;
        document.getElementById("score").innerHTML = "<i>Score</i>: <b>" + score + "</b>";
        alert("Hurray! You found some FOOD!!");
        curr.style.backgroundColor = "green";
    } else {
        if (curr_x !== grid_x - 1 && curr.style.backgroundColor !== "red" && curr.style.backgroundColor !== "green" && curr.style.backgroundColor !== "purple") {
            score += grid.length < 8 ? 10 : 15;
            document.getElementById("score").innerHTML = "<i>Score</i>: <b>" + score + "</b>";
            curr.style.backgroundColor = "purple";
        }
    }
    curr.innerHTML = "&#128694;";
}
