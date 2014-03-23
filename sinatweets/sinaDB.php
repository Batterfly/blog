<?php
    require('config.php');
     /*创建数据库*/
    mysql_query("CREATE DATABASE sinaTweet", $con);
    mysql_select_db('sinaTweet', $con);
    mysql_query("set names gb2312");

    /*table tweets*/
    $sql = "CREATE TABLE tweets(
            name varchar(20) NOT NULL,
            tweetid varchar(20) NOT NULL,
            userid varchar(20) NOT NULL,
            source varchar(100) NOT NULL,
            tweettext varchar(280) NOT NULL,
            PRIMARY KEY (tweetid, userid)
        )";
    mysql_query($sql, $con);

    mysql_close($con);
?>