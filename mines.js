let size = 8;
let bombs;
let values;
let states = new Array();
let nb_revealed;
let nb_flags;
let nb_bombs = 10;
let game_end = false;
const difficulty = {"easy" : {"nb_b" : 10, "s" : 8},
"medium" : {"nb_b" : 40, "s" : 14},
"hard" : {"nb_b" : 99, "s" : 20}};
let time_f;
let diff = "easy";

/* order:
1 2 3
8   4
7 6 5
*/
let xs = [-1,0,1,1,1,0,-1,-1];
let ys = [-1,-1,-1,0,1,1,1,0];

// displays table.
function displayTable() {
    let light;
    let pos;
    let html = "<table border='1px solid #FF0000'>";
    size = difficulty[diff]["s"];
    for (let y = 0; y < size; y++) {
        html += "<tr>";
        for (let x = 0; x < size; x++) {
            pos = y*size + x;
            if ((x % 2 == 0 && y % 2 == 0) 
            || (x % 2 == 1 && y % 2 == 1)) {
                light = 1;
            } else {
                light = 0;
            }
            html += ("<td id = " + pos + " onclick = 'guess(this)' class = " +
                (light?"light_hidden":"dark_hidden") + " oncontextmenu = 'return flag(this)'> </td>");
        }
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("t").innerHTML = html;
}

// displays the flag counter + table.
function initView() {
    counterBombs = nb_bombs + "/" + nb_bombs;
    document.getElementById("counter").innerHTML = counterBombs;
    displayTable();
}

// when the user changes diffulty, changes the variables
// diffulty and nb_bombs to well display the changed game.
function changeDifficulty(option) {
    diff = option.value;
    nb_bombs = difficulty[diff]["nb_b"];
    initView();
}

// checks if two tiles are really adjacent.
// to prevent two tiles - one at the end of
// line 1 and the other at the beggining of
// line 2 - from being considered adjacent.
function really_around(p1,p2) {
    let x1 = parseInt(p1) % size;
    let x2 = parseInt(p2) % size;
    if (Math.abs(x1-x2) < 2) {
        return true;
    } else {
        return false;
    }
}

// updates the timer displayed at the top.
// function called each second after initializing
// the game (called by function guess), stops when the 
// game ends (function endscreen)
function update_time() {
    let cur_time = document.getElementById("clock").querySelector("p").innerHTML.split(":");
    let min = cur_time[0];
    let sec = cur_time[1];
    if (sec == "59") {
        min = parseInt(min) + 1;
        sec = 0;
    } else if (sec == "59" && min == "59") {
        clearInterval(time_f);
    } else {
        sec = parseInt(sec) + 1;
    }
    min = min.toString().padStart(2,"0");
    sec = sec.toString().padStart(2,"0");
    document.getElementById("clock").querySelector("p").innerHTML = min + ":" + sec;
}

// initializes the playing field (bombs, numbers,
// state of each field - hidden at the beggining).
// parameter is there to make sure no bomb is on 
// the first chosen tile (or adjacent).
function fieldInit(init_tile) {
    bombs = new Array();
    values = new Array();
    states = new Array();
    nb_revealed = 0;
    size = difficulty[diff]["s"];
    nb_bombs = difficulty[diff]["nb_b"];
    nb_flags = nb_bombs;
    let no_bombs = [init_tile];
    let pos;
    let temp_pos;
    for (let j = 0;j<xs.length;j++) {
        temp_pos = init_tile + ys[j]*size + xs[j];
        no_bombs.push(temp_pos);
    }
    while (bombs.length < nb_bombs) {
        pos = Math.floor((Math.random() * size*size));
        if (!bombs.includes(pos) && !no_bombs.includes(pos)) {
            bombs.push(pos);
        }
    }

    // if the field is a bomb, the value of the field is X, else
    // goes through every field and counts the number of bombs 
    // next to it.
    // if at the end the number is zero, the value of the field
    // is blank, else its the number of neighbouring bombs
    let cpt;
    for (let i = 0;i<size*size;i++) {
        cpt = 0;
        if (bombs.includes(i)) {
            values.push("X");
        } else {
            for (let j = 0;j<xs.length;j++) {
                temp_pos = i + ys[j]*size + xs[j];
                if (bombs.includes(temp_pos) && really_around(i,temp_pos)) {
                    cpt += 1;
                }
            }
            if (cpt == 0) {
                values.push(" ");
            } else {
                values.push(cpt);
            }
        }
        states.push("?");
    }
}

// if tile passed as the argu is not flagged,
// flags it, otherwise unflags.
// impossible to reveal a tile if flagged.
// also updates the (used) flags count at
// the top of the page.
function flag(tile) {
    if (tile.classList.contains("flagged") && !game_end) {
        nb_flags += 1;
        tile.classList.remove("flagged");
        tile.onclick = function () {guess(this);}
        tile.innerHTML = " ";
    } else if (nb_flags > 0 && !game_end) {
        nb_flags -= 1;
        tile.classList.add("flagged");
        tile.onclick = "";
        tile.innerHTML = "<img src = 'flag.png'>";
    }
    if (nb_flags !== undefined) {
        document.getElementById("flag_count").querySelector("p").innerHTML = 
        nb_flags + "/" + nb_bombs;
    }
    return false;
}

// reveals the tile passed as the argu.
// if the current tile is empty (no number),
// calls itself recursivelly on all of its
// adjacent hidden tiles.
function reveal(cur_pos) {
    let temp_pos;
    nb_revealed += 1;
    states[cur_pos] = " ";
    document.getElementById(cur_pos).className = "grass";
    document.getElementById(cur_pos).setAttribute("onclick","");
    document.getElementById(cur_pos).setAttribute("oncontextmenu","return false");
    document.getElementById(cur_pos).innerHTML = values[cur_pos];
    if (values[cur_pos] == " ") {
        for (let i = 0; i < xs.length; i++) {
            temp_pos = parseInt(cur_pos) + ys[i]*size + xs[i];
            if (temp_pos < size*size && states[temp_pos] == "?" &&
            really_around(cur_pos,temp_pos)) {
                reveal(temp_pos);
            }
        }
    }
}

// makes the end screen visible.
// displays a message telling the player
// whether they won or lost.
function end_screen(win) {
    clearInterval(time_f);
    game_end = true;
    let e = document.getElementById("end");
    e.querySelector("p").innerHTML = (win)?"you won!!":"you lost :(";
    e.style.display = "flex";
}

// called each time the player guesses a tile.
// if its the player's first guess, initializes game,
// else reveals the tile passed as the argu (picked by
// the player).
function guess(tile) {
    let pos = tile.id
    if (values == undefined) {
        time_f = setInterval(update_time,1000);
        fieldInit(parseInt(pos));
    }
    if (!game_end) {
        reveal(pos);
    }
    if (values[pos] == "X") {
        // loss
        end_screen(false)
    } else if (nb_revealed == size*size - nb_bombs) {
        // win
        end_screen(true);
    }
}

// displays the game for the first time when
// the page loads with the default difficulty (easy)
initView();