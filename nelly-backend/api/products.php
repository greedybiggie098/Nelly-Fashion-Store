<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../controllers/ProductController.php';

$controller = new ProductController();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filters = [
        'category' => $_GET['category'] ?? null,
        'featured' => $_GET['featured'] ?? null,
        'search' => $_GET['search'] ?? null
    ];
    
    $result = $controller->getAll($filters);
    echo json_encode($result);
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
