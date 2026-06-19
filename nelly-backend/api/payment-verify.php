<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

// Paystack Secret Key
define('PAYSTACK_SECRET_KEY', 'sk_test_ac19cd50d4dbaea11ece6760cfcbe60f4e77bdf4');

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['reference'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Payment reference is required'
    ]);
    exit();
}

$reference = $input['reference'];

// Verify payment with Paystack
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => "https://api.paystack.co/transaction/verify/" . rawurlencode($reference),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => array(
        "Authorization: Bearer " . PAYSTACK_SECRET_KEY,
        "Cache-Control: no-cache",
    ),
));

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    echo json_encode([
        'success' => false,
        'message' => 'Payment verification failed: ' . $err
    ]);
    exit();
}

$result = json_decode($response, true);

if (!$result['status'] || $result['data']['status'] !== 'success') {
    echo json_encode([
        'success' => false,
        'message' => 'Payment was not successful'
    ]);
    exit();
}

// Payment verified successfully
$paymentData = $result['data'];

// Get order details from metadata
$metadata = $paymentData['metadata'];
$orderId = $metadata['order_id'] ?? null;

if ($orderId) {
    // Update order status to paid
    $database = new Database();
    $db = $database->getConnection();
    
    $query = "UPDATE orders SET 
              payment_status = 'paid',
              payment_reference = :reference,
              status = 'processing'
              WHERE id = :order_id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':reference', $reference);
    $stmt->bindParam(':order_id', $orderId);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Payment verified successfully',
            'data' => [
                'order_id' => $orderId,
                'reference' => $reference,
                'amount' => $paymentData['amount'] / 100, // Convert from kobo to naira
                'status' => $paymentData['status']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update order status'
        ]);
    }
} else {
    echo json_encode([
        'success' => true,
        'message' => 'Payment verified but no order ID found',
        'data' => [
            'reference' => $reference,
            'amount' => $paymentData['amount'] / 100,
            'status' => $paymentData['status']
        ]
    ]);
}
?>
