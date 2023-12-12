<?php
/*Install Midtrans PHP Library (https://github.com/Midtrans/midtrans-php)
composer require midtrans/midtrans-php
                              
Alternatively, if you are not using **Composer**, you can download midtrans-php library 
(https://github.com/Midtrans/midtrans-php/archive/master.zip), and then require 
the file manually.   

require_once dirname(__FILE__) . '/pathofproject/Midtrans.php'; */

require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';

//SAMPLE REQUEST START HERE

// Set your Merchant Server Key
\Midtrans\Config::$serverKey = 'SB-Mid-server-p-20k7GDcsKAGH0TyHZ4S-6r';
// Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
\Midtrans\Config::$isProduction = false;
// Set sanitization on (default)
\Midtrans\Config::$isSanitized = true;
// Set 3DS transaction for credit card to true
\Midtrans\Config::$is3ds = true;

// Data pesanan dan pembayaran yang dikirim dari sisi klien
$order_id = rand(); // Ganti dengan cara Anda yang sesuai untuk membuat order_id
$total = $_POST['total'];
$items = json_decode($_POST['items'], true);
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];

// Persiapkan parameter untuk dikirim ke Midtrans
$params = array(
    'transaction_details' => array(
        'order_id' => $order_id,
        'gross_amount' => $total,
    ),
    'item_details' => $items,
    'customer_details' => array(
        'first_name' => $name,
        'email' => $email,
        'phone' => $phone,
    ),
);

// Kirim request ke Midtrans untuk mendapatkan token transaksi
$midtransBaseUrl = 'https://api.midtrans.com/v2/charge';
$headers = array(
    'Content-Type: application/json',
    'Authorization: Basic ' . base64_encode($midtransServerKey . ':'),
);

$ch = curl_init($midtransBaseUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$midtransResponse = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch);
}

curl_close($ch);

// Decode respons dari Midtrans
$midtransResponseData = json_decode($midtransResponse, true);

// Kirim token transaksi ke sisi klien
echo json_encode(array('token' => $midtransResponseData['token']));
?>