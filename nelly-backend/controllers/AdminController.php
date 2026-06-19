<?php
require_once __DIR__ . '/../config/database.php';

class AdminController {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Check if user is admin
    public function isAdmin() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
            return false;
        }

        return true;
    }

    // Log admin activity
    public function logActivity($action, $description = '') {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['user_id'])) {
            return;
        }

        $query = "INSERT INTO admin_logs (admin_id, action, description, ip_address) 
                  VALUES (:admin_id, :action, :description, :ip_address)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':admin_id', $_SESSION['user_id']);
        $stmt->bindParam(':action', $action);
        $stmt->bindParam(':description', $description);
        
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $stmt->bindParam(':ip_address', $ip);
        
        $stmt->execute();
    }

    // Get dashboard statistics
    public function getDashboardStats() {
        if (!$this->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $stats = [];

        // Total users
        $query = "SELECT COUNT(*) as total FROM users WHERE role = 'customer'";
        $stmt = $this->conn->query($query);
        $stats['total_users'] = $stmt->fetch()['total'];

        // Total products
        $query = "SELECT COUNT(*) as total FROM products";
        $stmt = $this->conn->query($query);
        $stats['total_products'] = $stmt->fetch()['total'];

        // Total orders
        $query = "SELECT COUNT(*) as total FROM orders";
        $stmt = $this->conn->query($query);
        $stats['total_orders'] = $stmt->fetch()['total'];

        // Total revenue
        $query = "SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE status != 'cancelled'";
        $stmt = $this->conn->query($query);
        $stats['total_revenue'] = $stmt->fetch()['total'];

        // Recent orders
        $query = "SELECT o.*, u.name as customer_name, u.email as customer_email 
                  FROM orders o 
                  JOIN users u ON o.user_id = u.id 
                  ORDER BY o.created_at DESC 
                  LIMIT 10";
        $stmt = $this->conn->query($query);
        $stats['recent_orders'] = $stmt->fetchAll();

        // Orders by status
        $query = "SELECT status, COUNT(*) as count FROM orders GROUP BY status";
        $stmt = $this->conn->query($query);
        $stats['orders_by_status'] = $stmt->fetchAll();

        // Monthly revenue (last 6 months)
        $query = "SELECT 
                    DATE_FORMAT(created_at, '%Y-%m') as month,
                    SUM(total_price) as revenue
                  FROM orders 
                  WHERE status != 'cancelled'
                    AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                  GROUP BY month
                  ORDER BY month ASC";
        $stmt = $this->conn->query($query);
        $stats['monthly_revenue'] = $stmt->fetchAll();

        $this->logActivity('dashboard_view', 'Viewed dashboard statistics');

        return ['success' => true, 'stats' => $stats];
    }

    // Get all users
    public function getUsers($search = '', $page = 1, $limit = 20) {
        if (!$this->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $offset = ($page - 1) * $limit;

        $query = "SELECT id, name, email, role, created_at 
                  FROM users 
                  WHERE (name LIKE :search OR email LIKE :search)
                  ORDER BY created_at DESC 
                  LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        $searchTerm = "%$search%";
        $stmt->bindParam(':search', $searchTerm);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $users = $stmt->fetchAll();

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM users WHERE (name LIKE :search OR email LIKE :search)";
        $countStmt = $this->conn->prepare($countQuery);
        $countStmt->bindParam(':search', $searchTerm);
        $countStmt->execute();
        $total = $countStmt->fetch()['total'];

        return [
            'success' => true,
            'users' => $users,
            'total' => $total,
            'page' => $page,
            'pages' => ceil($total / $limit)
        ];
    }

    // Delete user
    public function deleteUser($userId) {
        if (!$this->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        // Prevent deleting yourself
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if ($_SESSION['user_id'] == $userId) {
            return ['success' => false, 'message' => 'Cannot delete your own account'];
        }

        $query = "DELETE FROM users WHERE id = :id AND role != 'admin'";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $userId);

        if ($stmt->execute()) {
            $this->logActivity('user_delete', "Deleted user ID: $userId");
            return ['success' => true, 'message' => 'User deleted successfully'];
        }

        return ['success' => false, 'message' => 'Failed to delete user'];
    }

    // Update user role
    public function updateUserRole($userId, $role) {
        if (!$this->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        if (!in_array($role, ['customer', 'admin'])) {
            return ['success' => false, 'message' => 'Invalid role'];
        }

        $query = "UPDATE users SET role = :role WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':id', $userId);

        if ($stmt->execute()) {
            $this->logActivity('user_role_update', "Updated user ID: $userId to role: $role");
            return ['success' => true, 'message' => 'User role updated successfully'];
        }

        return ['success' => false, 'message' => 'Failed to update user role'];
    }

    // Get all contacts
    public function getContacts($status = 'all', $page = 1, $limit = 20) {
        if (!$this->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $offset = ($page - 1) * $limit;

        $whereClause = $status !== 'all' ? "WHERE status = :status" : "";
        
        $query = "SELECT * FROM contacts $whereClause ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        $stmt = $this->conn->prepare($query);
        
        if ($status !== 'all') {
            $stmt->bindParam(':status', $status);
        }
        
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $contacts = $stmt->fetchAll();

        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM contacts" . ($status !== 'all' ? " WHERE status = :status" : "");
        $countStmt = $this->conn->prepare($countQuery);
        if ($status !== 'all') {
            $countStmt->bindParam(':status', $status);
        }
        $countStmt->execute();
        $total = $countStmt->fetch()['total'];

        return [
            'success' => true,
            'contacts' => $contacts,
            'total' => $total,
            'page' => $page,
            'pages' => ceil($total / $limit)
        ];
    }

    // Update contact status
    public function updateContactStatus($contactId, $status) {
        if (!$this->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        if (!in_array($status, ['new', 'read', 'replied'])) {
            return ['success' => false, 'message' => 'Invalid status'];
        }

        $query = "UPDATE contacts SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $contactId);

        if ($stmt->execute()) {
            $this->logActivity('contact_update', "Updated contact ID: $contactId to status: $status");
            return ['success' => true, 'message' => 'Contact status updated'];
        }

        return ['success' => false, 'message' => 'Failed to update contact'];
    }

    // Delete contact
    public function deleteContact($contactId) {
        if (!$this->isAdmin()) {
            return ['success' => false, 'message' => 'Unauthorized'];
        }

        $query = "DELETE FROM contacts WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $contactId);

        if ($stmt->execute()) {
            $this->logActivity('contact_delete', "Deleted contact ID: $contactId");
            return ['success' => true, 'message' => 'Contact deleted successfully'];
        }

        return ['success' => false, 'message' => 'Failed to delete contact'];
    }
}
