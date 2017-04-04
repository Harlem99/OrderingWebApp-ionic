<?php
header("Content-Type:application/json");

@$phone = $_REQUEST['phone'];
if(empty($phone))
{
    echo '[]';
    return;
}

require('init.php');

$sql = "select kf_order.user_name,kf_order.did,kf_order.oid,kf_order.order_time,kf_order.addr,kf_dish.img_sm from kf_dish,kf_order where kf_order.did=kf_dish.did AND kf_order.phone='$phone'";
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