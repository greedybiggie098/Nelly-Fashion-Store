<?php
require_once __DIR__ . '/../config/database.php';

class ProductController {
    private $conn;
    private $table_name = "products";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getAll($filters = []) {
        $query = "SELECT p.*, c.name as category_name, c.slug as category_slug 
                  FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE 1=1";
        
        $params = [];

        if (!empty($filters['category'])) {
            $query .= " AND c.slug = :category";
            $params[':category'] = $filters['category'];
        }

        if (!empty($filters['featured'])) {
            $query .= " AND p.is_featured = 1";
        }

        if (!empty($filters['search'])) {
            $query .= " AND (p.name LIKE :search OR p.description LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        $query .= " ORDER BY p.created_at DESC";

        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        $stmt->execute();
        $products = $stmt->fetchAll();

        // Parse JSON fields
        foreach ($products as &$product) {
            $product['sizes'] = json_decode($product['sizes'], true);
            $product['colors'] = json_decode($product['colors'], true);
            $product['price'] = (float)$product['price'];
            $product['discount_percentage'] = (int)$product['discount_percentage'];
            
            if ($product['discount_percentage'] > 0) {
                $product['discounted_price'] = $product['price'] * (1 - $product['discount_percentage'] / 100);
            }
        }

        return ['success' => true, 'products' => $products];
    }

    public function getById($id) {
        $query = "SELECT p.*, c.name as category_name, c.slug as category_slug 
                  FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            return ['success' => false, 'message' => 'Product not found'];
        }

        $product = $stmt->fetch();
        $product['sizes'] = json_decode($product['sizes'], true);
        $product['colors'] = json_decode($product['colors'], true);
        $product['price'] = (float)$product['price'];
        $product['discount_percentage'] = (int)$product['discount_percentage'];
        
        if ($product['discount_percentage'] > 0) {
            $product['discounted_price'] = $product['price'] * (1 - $product['discount_percentage'] / 100);
        }

        return ['success' => true, 'product' => $product];
    }

    public function getBySlug($slug) {
        $query = "SELECT p.*, c.name as category_name, c.slug as category_slug 
                  FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.slug = :slug";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':slug', $slug);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            return ['success' => false, 'message' => 'Product not found'];
        }

        $product = $stmt->fetch();
        $product['sizes'] = json_decode($product['sizes'], true);
        $product['colors'] = json_decode($product['colors'], true);
        $product['price'] = (float)$product['price'];
        $product['discount_percentage'] = (int)$product['discount_percentage'];
        
        if ($product['discount_percentage'] > 0) {
            $product['discounted_price'] = $product['price'] * (1 - $product['discount_percentage'] / 100);
        }

        return ['success' => true, 'product' => $product];
    }

    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                  (name, slug, description, price, category_id, image, stock, sizes, colors, is_featured, discount_percentage) 
                  VALUES (:name, :slug, :description, :price, :category_id, :image, :stock, :sizes, :colors, :is_featured, :discount_percentage)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':slug', $data['slug']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':category_id', $data['category_id']);
        $stmt->bindParam(':image', $data['image']);
        $stmt->bindParam(':stock', $data['stock']);
        $stmt->bindParam(':sizes', $data['sizes']);
        $stmt->bindParam(':colors', $data['colors']);
        $stmt->bindParam(':is_featured', $data['is_featured']);
        $stmt->bindParam(':discount_percentage', $data['discount_percentage']);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Product created', 'id' => $this->conn->lastInsertId()];
        }

        return ['success' => false, 'message' => 'Failed to create product'];
    }
}
