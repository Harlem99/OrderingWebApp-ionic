<?php
header("Content-Type:application/json");

@$start = $_REQUEST['start'];
if(empty($start))
{
    $start = 0;
}

require('init.php');

$sql = "select did,name,img_sm,price,material from kf_dish limit $start,5";
$result = mysqli_query($conn,$sql);
$output = [];
while(true)
{
    $row = mysqli_fetch_assoc($result);
    if(!$row)
    {
        break;
    }
    $output[] = $row;
}

echo json_encode($output);



?>