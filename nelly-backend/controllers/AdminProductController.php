<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/AdminController.php';

class AdminProductController {
    private $conn;
    private $adminController;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->adminController = new AdminController();
    }

    // Create product
    public function createProduct($data) {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        // Validate required fields
        $required = ['name', 'description', 'price', 'category_id', 'stock'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                return ['success' => false, 'message' => "Field $field is required"];
            }
        }

        // Generate slug
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name'])));

        // Check if slug exists
        $checkQuery = "SELECT id FROM products WHERE slug = :slug";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(':slug', $slug);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            $slug = $slug . '-' . time();
        }

        $query = "INSERT INTO products 
                  (name, slug, description, price, category_id, image, stock, sizes, colors, is_featured, discount_percentage) 
                  VALUES 
                  (:name, :slug, :description, :price, :category_id, :image, :stock, :sizes, :colors, :is_featured, :discount_percentage)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $slug);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':category_id', $data['category_id']);
        
        $image = $data['image'] ?? '';
        $stmt->bindParam(':image', $image);
        $stmt->bindParam(':stock', $data['stock']);
        
        $sizes = isset($data['sizes']) ? json_encode($data['sizes']) : '[]';
        $colors = isset($data['colors']) ? json_encode($data['colors']) : '[]';
        $stmt->bindParam(':sizes', $sizes);
        $stmt->bindParam(':colors', $colors);
        
        $is_featured = isset($data['is_featured']) ? (int)$data['is_featured'] : 0;
        $discount = isset($data['discount_percentage']) ? (int)$data['discount_percentage'] : 0;
        $stmt->bindParam(':is_featured', $is_featured);
        $stmt->bindParam(':discount_percentage', $discount);

        if ($stmt->execute()) {
            $productId = $this->conn->lastInsertId();
            $this->adminController->logActivity('product_create', "Created product: {$data['name']} (ID: $productId)");
            
            return [
                'success' => true,
                'message' => 'Product created successfully',
                'product_id' => $productId
            ];
        }

        return ['success' => false, 'message' => 'Failed to create product'];
    }

    // Update product
    public function updateProduct($productId, $data) {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        // Build update query dynamically
        $fields = [];
        $params = [':id' => $productId];

        $allowedFields = ['name', 'description', 'price', 'category_id', 'image', 'stock', 'is_featured', 'discount_percentage'];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }

        // Handle JSON fields
        if (isset($data['sizes'])) {
            $fields[] = "sizes = :sizes";
            $params[':sizes'] = json_encode($data['sizes']);
        }

        if (isset($data['colors'])) {
            $fields[] = "colors = :colors";
            $params[':colors'] = json_encode($data['colors']);
        }

        if (empty($fields)) {
            return ['success' => false, 'message' => 'No fields to update'];
        }

        $query = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        if ($stmt->execute()) {
            $this->adminController->logActivity('product_update', "Updated product ID: $productId");
            return ['success' => true, 'message' => 'Product updated successfully'];
        }

        return ['success' => false, 'message' => 'Failed to update product'];
    }

    // Delete product
    public function deleteProduct($productId) {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $query = "DELETE FROM products WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $productId);

        if ($stmt->execute()) {
            $this->adminController->logActivity('product_delete', "Deleted product ID: $productId");
            return ['success' => true, 'message' => 'Product deleted successfully'];
        }

        return ['success' => false, 'message' => 'Failed to delete product'];
    }

    // Get all products with pagination
    public function getProducts($page = 1, $limit = 20, $category = null, $search = '') {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $offset = ($page - 1) * $limit;

        $whereConditions = [];
        $params = [];

        if ($category) {
            $whereConditions[] = "p.category_id = :category";
            $params[':category'] = $category;
        }

        if ($search) {
            $whereConditions[] = "(p.name LIKE :search OR p.description LIKE :search)";
            $params[':search'] = "%$search%";
        }

        $whereClause = !empty($whereConditions) ? "WHERE " . implode(' AND ', $whereConditions) : "";

        $query = "SELECT p.*, c.name as category_name 
                  FROM products p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  $whereClause
                  ORDER BY p.created_at DESC 
                  LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $products = $stmt->fetchAll();

        // Decode JSON fields
        foreach ($products as &$product) {
            $product['sizes'] = json_decode($product['sizes'], true);
            $product['colors'] = json_decode($product['colors'], true);
        }

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM products p $whereClause";
        $countStmt = $this->conn->prepare($countQuery);
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $total = $countStmt->fetch()['total'];

        return [
            'success' => true,
            'products' => $products,
            'total' => $total,
            'page' => $page,
            'pages' => ceil($total / $limit)
        ];
    }
}
