<?php
session_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/WishlistController.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['product_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Product ID required']);
    exit();
}

$controller = new WishlistController();
$result = $controller->addToWishlist($_SESSION['user_id'], $data['product_id']);

echo json_encode($result);
