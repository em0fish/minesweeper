<div class = "container_end" id = "end">
<div class = "endscreen">
    <p> you won!! </p>
    <form>
        <button id = "again" onclick = "function (this) {this.style.display = 'none'; initView();}">
            play again?
        </button>
    </form>
</div>
</div>

<div class = "container">
<div class = "whole_board">

<div class = top>
<h1>minesweeper</h1>
<div class = "header">
    <div class = "flag_count" id = "flag_count">
        <img id = 'f' src = 'flag.png'>
        <p id = "counter" style = 'padding-left: 5px;'></p>
    </div>
    <div class = "clock" id = "clock">
        <p>00:00</p>
    </div>
    <div class = "dif">
    <form>
        <select name = "difficulty" id = "d" onchange = "changeDifficulty(this)">
            <option value = "easy">easy</option>
            <option value = "medium">medium</option>
            <option value = "hard">hard</option>
        </select>
    </form>
    </div>
</div>
</div>

<div id = "t"></div>

<div>
<form>
    <button onclick = "initView()">restart the game</button>
</form>
</div>
</div>
</div>