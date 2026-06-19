<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../controllers/CartController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$controller = new CartController();
$result = $controller->getCart();

http_response_code($result['success'] ? 200 : 401);
echo json_encode($result);
