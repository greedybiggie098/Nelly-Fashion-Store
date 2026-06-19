<?php
class Database {
    private $host = "localhost";
    private $db_name = "nelly_store";
    private $username = "root";
    private $password = "";
    public $conn;

    public function __construct() {
        $envFile = __DIR__ . '/../.env';
        if (file_exists($envFile)) {
            $env = parse_ini_file($envFile);
            if ($env !== false) {
                if (isset($env['DB_HOST'])) $this->host = $env['DB_HOST'];
                if (isset($env['DB_NAME'])) $this->db_name = $env['DB_NAME'];
                if (isset($env['DB_USER'])) $this->username = $env['DB_USER'];
                if (isset($env['DB_PASS'])) $this->password = $env['DB_PASS'];
            }
        }
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
