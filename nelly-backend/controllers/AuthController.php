<?php
require_once __DIR__ . '/../config/database.php';

class AuthController {
    private $conn;
    private $table_name = "users";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function register($data) {
        // Validate input
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            return ['success' => false, 'message' => 'All fields are required'];
        }

        // Validate email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return ['success' => false, 'message' => 'Invalid email format'];
        }

        // Check if email exists
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $data['email']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['success' => false, 'message' => 'Email already exists'];
        }

        // Hash password
        $hashed_password = password_hash($data['password'], PASSWORD_BCRYPT);

        // Insert user
        $query = "INSERT INTO " . $this->table_name . " (name, email, password) VALUES (:name, :email, :password)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":name", $data['name']);
        $stmt->bindParam(":email", $data['email']);
        $stmt->bindParam(":password", $hashed_password);

        if ($stmt->execute()) {
            $user_id = $this->conn->lastInsertId();
            
            // Create cart for user
            $cart_query = "INSERT INTO cart (user_id) VALUES (:user_id)";
            $cart_stmt = $this->conn->prepare($cart_query);
            $cart_stmt->bindParam(":user_id", $user_id);
            $cart_stmt->execute();

            // Start session
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_name'] = $data['name'];
            $_SESSION['user_email'] = $data['email'];
            $_SESSION['user_role'] = 'customer';

            return [
                'success' => true,
                'message' => 'Registration successful',
                'user' => [
                    'id' => $user_id,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => null,
                    'avatar' => null,
                    'role' => 'customer'
                ]
            ];
        }

        return ['success' => false, 'message' => 'Registration failed'];
    }

    public function login($data) {
        // Validate input
        if (empty($data['email']) || empty($data['password'])) {
            return ['success' => false, 'message' => 'Email and password are required'];
        }

        // Get user with all fields
        $query = "SELECT id, name, email, phone, avatar, password, role FROM " . $this->table_name . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $data['email']);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            return ['success' => false, 'message' => 'Invalid email or password'];
        }

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verify password
        if (!password_verify($data['password'], $user['password'])) {
            return ['success' => false, 'message' => 'Invalid email or password'];
        }

        // Start session
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];

        return [
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'avatar' => $user['avatar'],
                'role' => $user['role']
            ]
        ];
    }

    public function logout() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        session_destroy();
        return ['success' => true, 'message' => 'Logout successful'];
    }

    public function checkAuth() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (isset($_SESSION['user_id'])) {
            // Fetch complete user data from database
            $query = "SELECT id, name, email, phone, avatar, role FROM " . $this->table_name . " WHERE id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":user_id", $_SESSION['user_id']);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                return [
                    'success' => true,
                    'authenticated' => true,
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'phone' => $user['phone'],
                        'avatar' => $user['avatar'],
                        'role' => $user['role']
                    ]
                ];
            }
        }

        return ['success' => true, 'authenticated' => false];
    }
}
