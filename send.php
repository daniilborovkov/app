<?php

    $from = "maxarte99@gmail.com";

    $to = "maxgraph23@gmail.com";

    $subject = "Checking PHP mail";


	$project_name = trim($_POST["project_name"]);
	$admin_email  = trim($_POST["admin_email"]);
	$form_subject = trim($_POST["form_subject"]);
	$quantityProd = $_POST["Количество"];
	$summ = $_POST["Сумма"];
	$clientName = $_POST["Имя"];
	$clientTel = $_POST["Телефон"];
	$clientMail = $_POST["Email"];
	$jsonText = $_POST['Товары'];
	$myArray = json_decode($jsonText, true);


	foreach ($myArray as $key => $value) {
		$cat = $value["category"];
	    $title = $value["title"];
	    $elems = $value["elems"];
	    $price = $value["price"];
	    $message .= "
			<tr>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$cat</td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$title</td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$elems</td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$price</td>
			</tr>
			";
	}

	/*foreach ($_POST as $key => $value) {
		clientName = $value["name"];
		clientTel = $value["tel"];
	}*/

	
	$message = "<table style='width: 100%; border-spacing: 0; border-collapse: collapse;'>$message</table> <br> <strong>Количество товаров:</strong> $quantityProd <br> <strong>Сумма заказа:</strong> $summ <br> <strong>Имя клиента: </strong> $clientName <br> <strong>Номер телефона: </strong> $clientTel <br> <strong>Email:</strong> $clientMail";

	$headers = "MIME-Version: 1.0" . PHP_EOL .
	"Content-Type: text/html; charset=utf-8" . PHP_EOL .
	'From: '.$project_name.' <'.$admin_email.'>' . PHP_EOL .
	'Reply-To: '.$admin_email.'' . PHP_EOL;

    mail($to,$form_subject,$message, $headers);

?>
