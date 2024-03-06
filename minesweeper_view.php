<div class = "container_end" id = "end">
<div class = "endscreen">
    <p>you won!! </p>
    <form>
        <?php
        if (isset($_GET["difficulty"])) {
            echo "<input type = 'hidden' name = 'difficulty' value = {$_GET["difficulty"]}>";
        }
        ?>
        <button type = "submit" name = "res" value = "yes" id = "again" onclick = "function (this) {this.style.display = 'none';}">
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
    <?php
        $dif_list = ["easy" => ["size" => 8, "nb_bombs" => 10],
        "medium" => ["size" => 14, "nb_bombs" => 40],
        "hard" => ["size" => 20, "nb_bombs" => 99]];
        $last_picked = "easy";

        if (isset($_GET["difficulty"])) {
            $last_picked = $_GET["difficulty"];
        }

        $nb_flags = $dif_list[$last_picked]["nb_bombs"];
        echo "<img id = 'f' src = 'flag.png'><p style = 'padding-left: 5px;'>{$nb_flags}/{$nb_flags}</p>";
    ?>
    </div>
    <div class = "clock" id = "clock">
        <p>00:00</p>
    </div>
    <div class = "dif">
    <form>
        <select name = "difficulty" id = "d" onchange = "this.form.submit()">
            <?php 
                // selected default, then last picked
                foreach ($dif_list as $d => $size) {
                    echo "<option value = {$d} ";
                    echo ($last_picked == $d)?"selected = 'selected'":"";
                    echo " >{$d}</option>";
                }
            ?>
        </select>
    </form>
    </div>
</div>
</div>

<div>
<table border='1px solid #FF0000'><tr>

    <?php

    $size = $dif_list[$last_picked]["size"];

    for ($y = 0;$y < $size;$y++) {
        echo "<tr>";
        for ($x = 0;$x < $size;$x++) {
            $pos = $y*$size + $x;
            if (($x % 2 == 0 && $y % 2 == 0) 
            || ($x % 2 == 1 && $y % 2 == 1)) {
                $light = 1;
            } else {
                $light = 0;
            }
            echo "<td id = {$pos} onclick = 'guess(this)' class = "; 
            echo ($light)?"light_hidden":"dark_hidden";                
            echo " oncontextmenu = 'return flag(this)'> </td>";
        }
        echo "</tr>\n";
    }
    ?>

</table>
</div>
<div>
<form>
    <?php
    if (isset($_GET["difficulty"])) {
        echo "<input type = 'hidden' name = 'difficulty' value = {$_GET["difficulty"]}>";
    }
    ?>
    <button type="submit" name="res" value="yes">restart the game</button>
</form>
</div>
</div>
</div>