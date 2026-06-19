<?php
require_once __DIR__ . '/../config/database.php';

class UserAccountController {
    private $conn;
    private $db;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    // Get user profile
    public function getProfile($userId) {
        try {
            $query = "SELECT id, name, email, phone, avatar, gender, date_of_birth, 
                            address, city, state, country, postal_code, created_at 
                     FROM users WHERE id = :user_id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();

            $user = $stmt->fetch();
            
            if ($user) {
                return [
                    'success' => true,
                    'user' => $user
                ];
            }

            return [
                'success' => false,
                'message' => 'User not found'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching profile: ' . $e->getMessage()
            ];
        }
    }

    // Update user profile
    public function updateProfile($userId, $data) {
        try {
            $query = "UPDATE users SET 
                     name = :name,
                     email = :email,
                     phone = :phone,
                     gender = :gender,
                     date_of_birth = :date_of_birth,
                     address = :address,
                     city = :city,
                     state = :state,
                     country = :country,
                     postal_code = :postal_code
                     WHERE id = :user_id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':gender', $data['gender']);
            $stmt->bindParam(':date_of_birth', $data['date_of_birth']);
            $stmt->bindParam(':address', $data['address']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':state', $data['state']);
            $stmt->bindParam(':country', $data['country']);
            $stmt->bindParam(':postal_code', $data['postal_code']);
            $stmt->bindParam(':user_id', $userId);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Profile updated successfully'
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to update profile'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating profile: ' . $e->getMessage()
            ];
        }
    }

    // Upload avatar
    public function uploadAvatar($userId, $file) {
        try {
            // Validate file
            $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            $maxSize = 5 * 1024 * 1024; // 5MB

            if (!in_array($file['type'], $allowedTypes)) {
                return [
                    'success' => false,
                    'message' => 'Invalid file type. Only JPG, PNG, and GIF allowed.'
                ];
            }

            if ($file['size'] > $maxSize) {
                return [
                    'success' => false,
                    'message' => 'File too large. Maximum size is 5MB.'
                ];
            }

            // Create uploads directory if not exists
            $uploadDir = __DIR__ . '/../uploads/avatars/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            // Generate unique filename
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = 'avatar_' . $userId . '_' . time() . '.' . $extension;
            $filepath = $uploadDir . $filename;

            // Delete old avatar if exists
            $query = "SELECT avatar FROM users WHERE id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            $user = $stmt->fetch();

            if ($user && $user['avatar']) {
                $oldFile = $uploadDir . basename($user['avatar']);
                if (file_exists($oldFile)) {
                    unlink($oldFile);
                }
            }

            // Upload new file
            if (move_uploaded_file($file['tmp_name'], $filepath)) {
                // Update database
                $avatarUrl = 'uploads/avatars/' . $filename;
                $query = "UPDATE users SET avatar = :avatar WHERE id = :user_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':avatar', $avatarUrl);
                $stmt->bindParam(':user_id', $userId);
                
                if ($stmt->execute()) {
                    return [
                        'success' => true,
                        'message' => 'Avatar uploaded successfully',
                        'avatar' => $avatarUrl
                    ];
                }
            }

            return [
                'success' => false,
                'message' => 'Failed to upload avatar'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error uploading avatar: ' . $e->getMessage()
            ];
        }
    }

    // Change password
    public function changePassword($userId, $currentPassword, $newPassword) {
        try {
            // Verify current password
            $query = "SELECT password FROM users WHERE id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            $user = $stmt->fetch();

            if (!$user || !password_verify($currentPassword, $user['password'])) {
                return [
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ];
            }

            // Update password
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $query = "UPDATE users SET password = :password WHERE id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->bindParam(':user_id', $userId);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Password changed successfully'
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to change password'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error changing password: ' . $e->getMessage()
            ];
        }
    }

    // Get user orders
    public function getUserOrders($userId) {
        try {
            $query = "SELECT o.*, 
                            COUNT(oi.id) as item_count,
                            SUM(oi.quantity) as total_items
                     FROM orders o
                     LEFT JOIN order_items oi ON o.id = oi.order_id
                     WHERE o.user_id = :user_id
                     GROUP BY o.id
                     ORDER BY o.created_at DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();

            $orders = $stmt->fetchAll();

            return [
                'success' => true,
                'orders' => $orders
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching orders: ' . $e->getMessage()
            ];
        }
    }

    // Get order details
    public function getOrderDetails($userId, $orderId) {
        try {
            // Get order
            $query = "SELECT * FROM orders WHERE id = :order_id AND user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':order_id', $orderId);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            $order = $stmt->fetch();

            if (!$order) {
                return [
                    'success' => false,
                    'message' => 'Order not found'
                ];
            }

            // Get order items
            $query = "SELECT oi.*, p.name, p.image, p.slug
                     FROM order_items oi
                     JOIN products p ON oi.product_id = p.id
                     WHERE oi.order_id = :order_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':order_id', $orderId);
            $stmt->execute();
            $items = $stmt->fetchAll();

            $order['items'] = $items;

            return [
                'success' => true,
                'order' => $order
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching order details: ' . $e->getMessage()
            ];
        }
    }

    // Get user settings
    public function getSettings($userId) {
        try {
            $query = "SELECT * FROM user_settings WHERE user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            $settings = $stmt->fetch();

            // Create default settings if not exists
            if (!$settings) {
                $query = "INSERT INTO user_settings (user_id) VALUES (:user_id)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->execute();

                $query = "SELECT * FROM user_settings WHERE user_id = :user_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->execute();
                $settings = $stmt->fetch();
            }

            return [
                'success' => true,
                'settings' => $settings
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching settings: ' . $e->getMessage()
            ];
        }
    }

    // Update user settings
    public function updateSettings($userId, $data) {
        try {
            $query = "UPDATE user_settings SET 
                     email_notifications = :email_notifications,
                     order_updates = :order_updates,
                     promotional_emails = :promotional_emails,
                     sms_notifications = :sms_notifications
                     WHERE user_id = :user_id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email_notifications', $data['email_notifications'], PDO::PARAM_BOOL);
            $stmt->bindParam(':order_updates', $data['order_updates'], PDO::PARAM_BOOL);
            $stmt->bindParam(':promotional_emails', $data['promotional_emails'], PDO::PARAM_BOOL);
            $stmt->bindParam(':sms_notifications', $data['sms_notifications'], PDO::PARAM_BOOL);
            $stmt->bindParam(':user_id', $userId);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Settings updated successfully'
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to update settings'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating settings: ' . $e->getMessage()
            ];
        }
    }
}
