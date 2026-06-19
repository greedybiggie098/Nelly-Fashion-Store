<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/AdminCategoryController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$controller = new AdminCategoryController();
$result = $controller->getCategories();

http_response_code($result['success'] ? 200 : 403);
echo json_encode($result);
