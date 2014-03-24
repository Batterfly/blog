<?php
  require('config.php');

   $data = isset($_POST['data']) ? $_POST['data'] : '';
   var_dump($data);
   $num = count($data);
   for ($i = 0; $i < $num; $i += 8) {
        $name = $data[$i];
        $tweetid = $data[$i+1];
        $userid = $data[$i+2];
        $source = $data[$i+3];
        $text = $data[$i+4];
        $create_at = $data[$i+5];
        $reposts = $data[$i+6];
        $comments = $data[$i+7];
        $sql = "insert into newtweets (tweetid, name, userid, source, tweettext, create_at, reposts, comments) values('$tweetid', '$name', '$userid', '$source', '$text', '$create_at', '$reposts', '$comments')";
        $res = mysql_query($sql, $con);
       // echo $sql."\n";
       if ($res) {
            echo 'insert success!'."\n";
       } else {
            echo 'error!'."\n";
       }
   }
   
  ?>