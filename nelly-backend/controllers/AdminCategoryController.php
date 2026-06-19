<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/AdminController.php';

class AdminCategoryController {
    private $conn;
    private $adminController;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->adminController = new AdminController();
    }

    // Get all categories
    public function getCategories() {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $query = "SELECT c.*, COUNT(p.id) as product_count 
                  FROM categories c 
                  LEFT JOIN products p ON c.id = p.category_id 
                  GROUP BY c.id 
                  ORDER BY c.name ASC";
        
        $stmt = $this->conn->query($query);
        $categories = $stmt->fetchAll();

        return ['success' => true, 'categories' => $categories];
    }

    // Create category
    public function createCategory($data) {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        if (empty($data['name'])) {
            return ['success' => false, 'message' => 'Category name is required'];
        }

        // Generate slug
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name'])));

        // Check if slug exists
        $checkQuery = "SELECT id FROM categories WHERE slug = :slug";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(':slug', $slug);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            return ['success' => false, 'message' => 'Category already exists'];
        }

        $query = "INSERT INTO categories (name, slug, description) VALUES (:name, :slug, :description)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $slug);
        
        $description = $data['description'] ?? '';
        $stmt->bindParam(':description', $description);

        if ($stmt->execute()) {
            $categoryId = $this->conn->lastInsertId();
            $this->adminController->logActivity('category_create', "Created category: {$data['name']} (ID: $categoryId)");
            
            return [
                'success' => true,
                'message' => 'Category created successfully',
                'category_id' => $categoryId
            ];
        }

        return ['success' => false, 'message' => 'Failed to create category'];
    }

    // Update category
    public function updateCategory($categoryId, $data) {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $fields = [];
        $params = [':id' => $categoryId];

        if (isset($data['name'])) {
            $fields[] = "name = :name";
            $params[':name'] = $data['name'];
        }

        if (isset($data['description'])) {
            $fields[] = "description = :description";
            $params[':description'] = $data['description'];
        }

        if (empty($fields)) {
            return ['success' => false, 'message' => 'No fields to update'];
        }

        $query = "UPDATE categories SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        if ($stmt->execute()) {
            $this->adminController->logActivity('category_update', "Updated category ID: $categoryId");
            return ['success' => true, 'message' => 'Category updated successfully'];
        }

        return ['success' => false, 'message' => 'Failed to update category'];
    }

    // Delete category
    public function deleteCategory($categoryId) {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        // Check if category has products
        $checkQuery = "SELECT COUNT(*) as count FROM products WHERE category_id = :id";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(':id', $categoryId);
        $checkStmt->execute();
        
        $count = $checkStmt->fetch()['count'];
        
        if ($count > 0) {
            return ['success' => false, 'message' => "Cannot delete category with $count products"];
        }

        $query = "DELETE FROM categories WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $categoryId);

        if ($stmt->execute()) {
            $this->adminController->logActivity('category_delete', "Deleted category ID: $categoryId");
            return ['success' => true, 'message' => 'Category deleted successfully'];
        }

        return ['success' => false, 'message' => 'Failed to delete category'];
    }
}
