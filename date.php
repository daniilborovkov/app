<?php


$result=array();
$result['status']='ok';
$result['server_datetimeY']=date("Y");
$result['server_datetimeM']=date("m");
$result['server_datetimeD']=date("j");
$result['server_datetimeT']=date("t");
echo json_encode($result);


?>