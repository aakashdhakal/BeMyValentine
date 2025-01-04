<?php
use PHPMailer\PHPMailer\PHPMailer;
header("Content-Type: application/json");

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $crush = $_POST['crush'];
    $email = $_POST['email'];
    $status = $_POST['status'];
    if ($status == "yes") {
        $htmlContent = "
            <html>
            <head>
                <title>Proposal Accepted</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #ffe6e6; color: #cc0000; }
                    h1 { color: #ff0066; }
                    p { font-size: 16px; }
                    .container { padding: 20px; border: 2px solid #ff0066; border-radius: 10px; background-color: #fff; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h1>Congratulations!</h1>
                    <p>Dear User,</p>
                    <p>You will be thrilled to hear that $crush has accepted your proposal</p>
                    <p>We wish you all the best for your future.</p>
                </div>
            </body>
            </html>
        ";
    } else {
        $htmlContent = "
            <html>
            <head>
                <title>Proposal Rejected</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #ffe6e6; color: #cc0000; }
                    h1 { color: #ff0066; }
                    p { font-size: 16px; }
                    .container { padding: 20px; border: 2px solid #ff0066; border-radius: 10px; background-color: #fff; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h1>We're Sorry!</h1>
                    <p>Dear User,</p>
                    <p>We regret to inform you that $crush has rejected your proposal</p>
                    <p>Don't worry, there are plenty of fish in the sea</p>
                </div>
            </body>
            </html>
        ";
    }

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;
    $mail->Username = "anoother124@gmail.com";
    $mail->Password = "ailfbddokyddbqhh";
    $mail->SMTPSecure = "ssl";
    $mail->Port = 465;

    $mail->setFrom("noreply@aakashdhakal.com.np");
    $mail->addAddress($email);
    $mail->isHTML(true);
    $mail->Subject = "Your Proposal is answered";
    $mail->Body = $htmlContent;

    if ($mail->send()) {
        echo json_encode(["status" => 200]);
    } else {
        echo json_encode(["status" => 400, "error" => $mail->ErrorInfo]);
    }
}
echo json_encode(["status" => 404]);