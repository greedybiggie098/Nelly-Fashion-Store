<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../controllers/CartController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['item_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Item ID required']);
    exit();
}

$controller = new CartController();
$result = $controller->removeItem($data['item_id']);

http_response_code($result['success'] ? 200 : 400);
echo json_encode($result);
