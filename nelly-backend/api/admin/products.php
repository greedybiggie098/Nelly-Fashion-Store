<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/AdminProductController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$controller = new AdminProductController();

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
$category = $_GET['category'] ?? null;
$search = $_GET['search'] ?? '';

$result = $controller->getProducts($page, $limit, $category, $search);

http_response_code($result['success'] ? 200 : 403);
echo json_encode($result);
