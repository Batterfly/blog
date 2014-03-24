<?php
    require('config.php');
     /*创建数据库*/
    mysql_query("CREATE DATABASE sinaTweet", $con);
    mysql_select_db('sinaTweet', $con);
    mysql_query("set names gb2312");

    /*table tweets*/
    $sql = "CREATE TABLE newtweets(
            tweetid varchar(20) NOT NULL UNIQUE,    /*微博id*/
            name varchar(100) NOT NULL,         /*用户名*/
            userid varchar(20) NOT NULL,
            source varchar(100) NOT NULL,       /*微博来源*/
            tweettext varchar(280) NOT NULL,
            create_at varchar(80) NOT NULL,         /*微博时间*/
            reposts varchar(6) NOT NULL,            /*微博转发数*/
            comments varchar(6) NOT NULL,           /*微博评论数*/
            PRIMARY KEY (tweetid)
        )";
    mysql_query($sql, $con);

    mysql_close($con);
?>