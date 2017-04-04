<?php
header("Content-Type:application/json");

@$id = $_REQUEST['id'];
if(empty($id))
{
    echo '[]';
    return;
}

require('init.php');

$sql = "select did,name,img_lg,price,material,detail from kf_dish where did=$id";
$result = mysqli_query($conn,$sql);
$output = [];
$row = mysqli_fetch_assoc($result);
if(empty($row))
{
    echo '[]';
}
else
{
    $output[] = $row;
    echo json_encode($output);
}





?>