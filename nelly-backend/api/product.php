<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../controllers/ProductController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$controller = new ProductController();

if (isset($_GET['id'])) {
    $result = $controller->getById($_GET['id']);
} elseif (isset($_GET['slug'])) {
    $result = $controller->getBySlug($_GET['slug']);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Product ID or slug required']);
    exit();
}

http_response_code($result['success'] ? 200 : 404);
echo json_encode($result);
