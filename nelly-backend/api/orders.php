<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../controllers/OrderController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$controller = new OrderController();

if (isset($_GET['id'])) {
    $result = $controller->getOrderById($_GET['id']);
} else {
    $result = $controller->getOrders();
}

http_response_code($result['success'] ? 200 : 404);
echo json_encode($result);
