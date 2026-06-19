<?php
require_once __DIR__ . '/../config/database.php';

class CartController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    private function getUserId() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        return $_SESSION['user_id'] ?? null;
    }

    private function getOrCreateCart($user_id) {
        $query = "SELECT id FROM cart WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return $stmt->fetch()['id'];
        }

        $insert_query = "INSERT INTO cart (user_id) VALUES (:user_id)";
        $insert_stmt = $this->conn->prepare($insert_query);
        $insert_stmt->bindParam(':user_id', $user_id);
        $insert_stmt->execute();

        return $this->conn->lastInsertId();
    }

    public function getCart() {
        $user_id = $this->getUserId();
        if (!$user_id) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $cart_id = $this->getOrCreateCart($user_id);

        $query = "SELECT ci.*, p.name, p.price, p.image, p.stock, p.discount_percentage
                  FROM cart_items ci
                  JOIN products p ON ci.product_id = p.id
                  WHERE ci.cart_id = :cart_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cart_id', $cart_id);
        $stmt->execute();

        $items = $stmt->fetchAll();
        
        foreach ($items as &$item) {
            $item['price'] = (float)$item['price'];
            $item['discount_percentage'] = (int)$item['discount_percentage'];
            
            if ($item['discount_percentage'] > 0) {
                $item['discounted_price'] = $item['price'] * (1 - $item['discount_percentage'] / 100);
                $item['item_total'] = $item['discounted_price'] * $item['quantity'];
            } else {
                $item['item_total'] = $item['price'] * $item['quantity'];
            }
        }

        return ['success' => true, 'items' => $items];
    }

    public function addItem($data) {
        $user_id = $this->getUserId();
        if (!$user_id) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $cart_id = $this->getOrCreateCart($user_id);

        // Check if item already exists
        $check_query = "SELECT id, quantity FROM cart_items 
                        WHERE cart_id = :cart_id AND product_id = :product_id 
                        AND size = :size AND color = :color";
        $check_stmt = $this->conn->prepare($check_query);
        $check_stmt->bindParam(':cart_id', $cart_id);
        $check_stmt->bindParam(':product_id', $data['product_id']);
        $check_stmt->bindParam(':size', $data['size']);
        $check_stmt->bindParam(':color', $data['color']);
        $check_stmt->execute();

        if ($check_stmt->rowCount() > 0) {
            // Update quantity
            $existing = $check_stmt->fetch();
            $new_quantity = $existing['quantity'] + ($data['quantity'] ?? 1);
            
            $update_query = "UPDATE cart_items SET quantity = :quantity WHERE id = :id";
            $update_stmt = $this->conn->prepare($update_query);
            $update_stmt->bindParam(':quantity', $new_quantity);
            $update_stmt->bindParam(':id', $existing['id']);
            $update_stmt->execute();

            return ['success' => true, 'message' => 'Cart updated'];
        }

        // Insert new item
        $query = "INSERT INTO cart_items (cart_id, product_id, quantity, size, color) 
                  VALUES (:cart_id, :product_id, :quantity, :size, :color)";
        $stmt = $this->conn->prepare($query);
        
        $quantity = $data['quantity'] ?? 1;
        $stmt->bindParam(':cart_id', $cart_id);
        $stmt->bindParam(':product_id', $data['product_id']);
        $stmt->bindParam(':quantity', $quantity);
        $stmt->bindParam(':size', $data['size']);
        $stmt->bindParam(':color', $data['color']);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Item added to cart'];
        }

        return ['success' => false, 'message' => 'Failed to add item'];
    }

    public function updateItem($data) {
        $user_id = $this->getUserId();
        if (!$user_id) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $query = "UPDATE cart_items ci
                  JOIN cart c ON ci.cart_id = c.id
                  SET ci.quantity = :quantity
                  WHERE ci.id = :item_id AND c.user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':quantity', $data['quantity']);
        $stmt->bindParam(':item_id', $data['item_id']);
        $stmt->bindParam(':user_id', $user_id);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Cart updated'];
        }

        return ['success' => false, 'message' => 'Failed to update cart'];
    }

    public function removeItem($item_id) {
        $user_id = $this->getUserId();
        if (!$user_id) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $query = "DELETE ci FROM cart_items ci
                  JOIN cart c ON ci.cart_id = c.id
                  WHERE ci.id = :item_id AND c.user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':item_id', $item_id);
        $stmt->bindParam(':user_id', $user_id);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Item removed'];
        }

        return ['success' => false, 'message' => 'Failed to remove item'];
    }

    public function clearCart() {
        $user_id = $this->getUserId();
        if (!$user_id) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $cart_id = $this->getOrCreateCart($user_id);

        $query = "DELETE FROM cart_items WHERE cart_id = :cart_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':cart_id', $cart_id);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Cart cleared'];
        }

        return ['success' => false, 'message' => 'Failed to clear cart'];
    }
}
