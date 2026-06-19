<?php
require_once __DIR__ . '/../config/database.php';

class ContactController {
    private $conn;
    private $table_name = "contacts";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function create($data) {
        // Validate input
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            return ['success' => false, 'message' => 'Name, email, and message are required'];
        }

        // Validate email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Invalid email format'];
        }

        $query = "INSERT INTO " . $this->table_name . " (name, email, phone, subject, message) 
                  VALUES (:name, :email, :phone, :subject, :message)";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':subject', $data['subject']);
        $stmt->bindParam(':message', $data['message']);

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Message sent successfully'];
        }

        return ['success' => false, 'message' => 'Failed to send message'];
    }
}
