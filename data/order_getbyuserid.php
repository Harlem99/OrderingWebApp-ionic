<?php
/**根据用户id查询订单数据**/
header('Content-Type:application/json');

$output = [];

@$userid = $_REQUEST['userid'];

if(empty($userid)){
    echo "[]"; //若客户端未提交用户id，则返回一个空数组，
    return;    //并退出当前页面的执行
}

//访问数据库
require('init.php');

$sql = "SELECT kf_order.oid,kf_order.userid,kf_order.phone,kf_order.addr,
kf_order.totalprice,kf_order.user_name,kf_order.order_time,
kf_orderdetails.did,kf_orderdetails.dishcount,kf_orderdetails.price,
kf_dish.name,kf_dish.img_sm

 from kf_order,kf_orderdetails,kf_dish
WHERE kf_order.oid = kf_orderdetails.oid and kf_orderdetails.did = kf_dish.did and kf_order.userid='$userid'";
$result = mysqli_query($conn, $sql);

$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($output);
?>
