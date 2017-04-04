<?php
/*此页面中为通用代码，由其他php页面调用*/
//$conn = mysqli_connect('127.0.0.1','root','','kaifanla_new');
$conn = mysqli_connect(SAE_MYSQL_HOST_M, SAE_MYSQL_USER, SAE_MYSQL_PASS,  SAE_MYSQL_DB, SAE_MYSQL_PORT);
$sql = 'SET NAMES UTF8';
mysqli_query($conn,  $sql);
?>
