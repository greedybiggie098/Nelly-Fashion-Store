<?php
session_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/AddressController.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit();
}

$addressId = $data['id'];
unset($data['id']);

$controller = new AddressController();
$result = $controller->updateAddress($_SESSION['user_id'], $addressId, $data);

echo json_encode($result);
