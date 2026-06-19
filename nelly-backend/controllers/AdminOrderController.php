<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/AdminController.php';

class AdminOrderController {
    private $conn;
    private $adminController;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->adminController = new AdminController();
    }

    // Get all orders
    public function getOrders($status = 'all', $page = 1, $limit = 20) {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $offset = ($page - 1) * $limit;

        $whereClause = $status !== 'all' ? "WHERE o.status = :status" : "";
        
        $query = "SELECT o.*, u.name as customer_name, u.email as customer_email 
                  FROM orders o 
                  JOIN users u ON o.user_id = u.id 
                  $whereClause
                  ORDER BY o.created_at DESC 
                  LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        
        if ($status !== 'all') {
            $stmt->bindParam(':status', $status);
        }
        
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $orders = $stmt->fetchAll();

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM orders o" . ($status !== 'all' ? " WHERE o.status = :status" : "");
        $countStmt = $this->conn->prepare($countQuery);
        if ($status !== 'all') {
            $countStmt->bindParam(':status', $status);
        }
        $countStmt->execute();
        $total = $countStmt->fetch()['total'];

        return [
            'success' => true,
            'orders' => $orders,
            'total' => $total,
            'page' => $page,
            'pages' => ceil($total / $limit)
        ];
    }

    // Get order details
    public function getOrderDetails($orderId) {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        // Get order
        $query = "SELECT o.*, u.name as customer_name, u.email as customer_email, u.id as customer_id
                  FROM orders o 
                  JOIN users u ON o.user_id = u.id 
                  WHERE o.id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $orderId);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            return ['success' => false, 'message' => 'Order not found'];
        }

        $order = $stmt->fetch();

        // Get order items
        $itemsQuery = "SELECT oi.*, p.name as product_name, p.image as product_image
                       FROM order_items oi
                       JOIN products p ON oi.product_id = p.id
                       WHERE oi.order_id = :order_id";
        
        $itemsStmt = $this->conn->prepare($itemsQuery);
        $itemsStmt->bindParam(':order_id', $orderId);
        $itemsStmt->execute();

        $order['items'] = $itemsStmt->fetchAll();

        return ['success' => true, 'order' => $order];
    }

    // Update order status
    public function updateOrderStatus($orderId, $status) {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!in_array($status, $validStatuses)) {
            return ['success' => false, 'message' => 'Invalid status'];
        }

        $query = "UPDATE orders SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $orderId);

        if ($stmt->execute()) {
            $this->adminController->logActivity('order_status_update', "Updated order ID: $orderId to status: $status");
            return ['success' => true, 'message' => 'Order status updated successfully'];
        }

        return ['success' => false, 'message' => 'Failed to update order status'];
    }

    // Delete order
    public function deleteOrder($orderId) {
        if (!$this->adminController->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $query = "DELETE FROM orders WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $orderId);

        if ($stmt->execute()) {
            $this->adminController->logActivity('order_delete', "Deleted order ID: $orderId");
            return ['success' => true, 'message' => 'Order deleted successfully'];
        }

        return ['success' => false, 'message' => 'Failed to delete order'];
    }
}
