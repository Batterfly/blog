<?php
    $server = 'localhost';
    $username = 'root';
    $password = 'root';
    $dbname= 'sinaTweet';
    $con=mysql_connect($server, $username, $password) or die('Can not connect to the database because:'.mysql_error());
    mysql_select_db($dbname, $con);
?>