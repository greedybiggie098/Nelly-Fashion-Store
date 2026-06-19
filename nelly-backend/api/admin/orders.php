<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/AdminOrderController.php';

$controller = new AdminOrderController();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get all orders or single order
    if (isset($_GET['id'])) {
        $result = $controller->getOrderDetails($_GET['id']);
    } else {
        $status = $_GET['status'] ?? 'all';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        
        $result = $controller->getOrders($status, $page, $limit);
    }
    
    http_response_code($result['success'] ? 200 : 403);
    echo json_encode($result);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
