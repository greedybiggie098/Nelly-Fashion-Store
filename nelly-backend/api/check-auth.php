<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../controllers/AuthController.php';

$controller = new AuthController();
$result = $controller->checkAuth();

echo json_encode($result);
