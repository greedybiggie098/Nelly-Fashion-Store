<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/AdminProductController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['product_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Product ID is required']);
    exit();
}

$productId = $data['product_id'];
unset($data['product_id']);

$controller = new AdminProductController();
$result = $controller->updateProduct($productId, $data);

http_response_code($result['success'] ? 200 : 400);
echo json_encode($result);
