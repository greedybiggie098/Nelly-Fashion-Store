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

$controller = new WishlistController();
$result = $controller->getWishlist($_SESSION['user_id']);

echo json_encode($result);
