<?php
session_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../controllers/UserAccountController.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

if (!isset($_FILES['avatar'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No file uploaded']);
    exit();
}

$controller = new UserAccountController();
$result = $controller->uploadAvatar($_SESSION['user_id'], $_FILES['avatar']);

echo json_encode($result);
