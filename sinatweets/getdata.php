<?php
  require('config.php');

    $day = isset($_POST['day']) ? $_POST['day'] : true;
    $hour = isset($_POST['hour']) ? $_POST['hour'] : '';
    $month = isset($_POST['month']) ? $_POST['month'] : '';
   
    
    if ($day) {
        $dayData = "";
        $sql = "SELECT * FROM day";
        $res = mysql_query($sql, $con);
        $num = mysql_num_rows($res);

        if ($num > 0) {
            while ($row = mysql_fetch_array($res)) {
                list($word, $percent) = $row;
                $dayData .= "$word,$percent,";
            }
            $dayData = substr_replace($dayData, "", -2);
        } 
        $dayData .= "";
        echo $dayData;
    }
  ?>