<?php
require_once __DIR__ . '/../config/database.php';

class OrderController {
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

    public function createOrder($data) {
        $user_id = $this->getUserId();
        if (!$user_id) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        try {
            $this->conn->beginTransaction();

            // Create order
            $order_query = "INSERT INTO orders (user_id, total_price, subtotal, tax, shipping, shipping_address) 
                           VALUES (:user_id, :total_price, :subtotal, :tax, :shipping, :shipping_address)";
            $order_stmt = $this->conn->prepare($order_query);
            
            $order_stmt->bindParam(':user_id', $user_id);
            $order_stmt->bindParam(':total_price', $data['total_price']);
            $order_stmt->bindParam(':subtotal', $data['subtotal']);
            $order_stmt->bindParam(':tax', $data['tax']);
            $order_stmt->bindParam(':shipping', $data['shipping']);
            $order_stmt->bindParam(':shipping_address', $data['shipping_address']);
            $order_stmt->execute();

            $order_id = $this->conn->lastInsertId();

            // Get cart items
            $cart_query = "SELECT ci.*, p.price, p.discount_percentage
                          FROM cart_items ci
                          JOIN cart c ON ci.cart_id = c.id
                          JOIN products p ON ci.product_id = p.id
                          WHERE c.user_id = :user_id";
            $cart_stmt = $this->conn->prepare($cart_query);
            $cart_stmt->bindParam(':user_id', $user_id);
            $cart_stmt->execute();
            $cart_items = $cart_stmt->fetchAll();

            // Insert order items
            $item_query = "INSERT INTO order_items (order_id, product_id, quantity, price, size, color) 
                          VALUES (:order_id, :product_id, :quantity, :price, :size, :color)";
            $item_stmt = $this->conn->prepare($item_query);

            foreach ($cart_items as $item) {
                $price = $item['price'];
                if ($item['discount_percentage'] > 0) {
                    $price = $price * (1 - $item['discount_percentage'] / 100);
                }

                $item_stmt->bindParam(':order_id', $order_id);
                $item_stmt->bindParam(':product_id', $item['product_id']);
                $item_stmt->bindParam(':quantity', $item['quantity']);
                $item_stmt->bindParam(':price', $price);
                $item_stmt->bindParam(':size', $item['size']);
                $item_stmt->bindParam(':color', $item['color']);
                $item_stmt->execute();

                // Update product stock
                $stock_query = "UPDATE products SET stock = stock - :quantity WHERE id = :product_id";
                $stock_stmt = $this->conn->prepare($stock_query);
                $stock_stmt->bindParam(':quantity', $item['quantity']);
                $stock_stmt->bindParam(':product_id', $item['product_id']);
                $stock_stmt->execute();
            }

            // Clear cart
            $clear_query = "DELETE ci FROM cart_items ci
                           JOIN cart c ON ci.cart_id = c.id
                           WHERE c.user_id = :user_id";
            $clear_stmt = $this->conn->prepare($clear_query);
            $clear_stmt->bindParam(':user_id', $user_id);
            $clear_stmt->execute();

            $this->conn->commit();

            return ['success' => true, 'message' => 'Order placed successfully', 'order_id' => $order_id];
        } catch (Exception $e) {
            $this->conn->rollBack();
            return ['success' => false, 'message' => 'Failed to place order: ' . $e->getMessage()];
        }
    }

    public function getOrders() {
        $user_id = $this->getUserId();
        if (!$user_id) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $query = "SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        $orders = $stmt->fetchAll();

        foreach ($orders as &$order) {
            $order['total_price'] = (float)$order['total_price'];
            $order['subtotal'] = (float)$order['subtotal'];
            $order['tax'] = (float)$order['tax'];
            $order['shipping'] = (float)$order['shipping'];

            // Get order items
            $items_query = "SELECT oi.*, p.name, p.image
                           FROM order_items oi
                           JOIN products p ON oi.product_id = p.id
                           WHERE oi.order_id = :order_id";
            $items_stmt = $this->conn->prepare($items_query);
            $items_stmt->bindParam(':order_id', $order['id']);
            $items_stmt->execute();
            $order['items'] = $items_stmt->fetchAll();
        }

        return ['success' => true, 'orders' => $orders];
    }

    public function getOrderById($order_id) {
        $user_id = $this->getUserId();
        if (!$user_id) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $query = "SELECT * FROM orders WHERE id = :order_id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':order_id', $order_id);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            return ['success' => false, 'message' => 'Order not found'];
        }

        $order = $stmt->fetch();
        $order['total_price'] = (float)$order['total_price'];
        $order['subtotal'] = (float)$order['subtotal'];
        $order['tax'] = (float)$order['tax'];
        $order['shipping'] = (float)$order['shipping'];

        // Get order items
        $items_query = "SELECT oi.*, p.name, p.image
                       FROM order_items oi
                       JOIN products p ON oi.product_id = p.id
                       WHERE oi.order_id = :order_id";
        $items_stmt = $this->conn->prepare($items_query);
        $items_stmt->bindParam(':order_id', $order_id);
        $items_stmt->execute();
        $order['items'] = $items_stmt->fetchAll();

        return ['success' => true, 'order' => $order];
    }
}
