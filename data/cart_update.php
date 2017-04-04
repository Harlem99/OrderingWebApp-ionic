<?php
/**
*更新购物车中商品的信息
*请求参数：
  uid-用户ID，必需
  did-dishID，必需
  count-更新的产品数量 必须 如果为-1，则是在之前基础上加一，如果为其他值，就是设置为该值
*输出结果：
* {"code":1,"msg":"succ"}//加入成功
* 或
* {"code":2,"msg":"succ"}//更新数量成功
*/
@$uid = $_REQUEST['uid'] or die('uid required');
@$did = $_REQUEST['did'] or die('did required');
@$count = $_REQUEST['count'] or die('did required');

require('init.php');

//判断购物车表中是否已经存在该商品记录
$sql = "SELECT ctid FROM kf_cart WHERE userid=$uid AND did=$did";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($row){
  if($count == -1) //之前曾经购买过该商品，则更新购买数量加1
  {
    $sql = "update kf_cart set dishCount=dishCount+1 where userid=$uid AND did=$did";
  }
  else //之前曾经购买过该商品，则更新购买数量为参数中的$count
  {
    $sql = "update kf_cart set dishCount='$count' where userid=$uid AND did=$did";
  }

  mysqli_query($conn,$sql);
  $output['code'] = 2;
  $output['msg'] = 'succ';
}else {     //之前从未购买过该商品，则添加购买记录，购买数量为1
  $sql = "INSERT INTO kf_cart VALUES(NULL,$uid, $did,1)";
  mysqli_query($conn,$sql);
  $output['code'] = 1;
  $output['msg'] = 'succ';
}

echo json_encode($output);
