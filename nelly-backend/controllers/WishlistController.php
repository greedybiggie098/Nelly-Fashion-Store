<?php
require_once __DIR__ . '/../config/database.php';

class WishlistController {
    private $conn;
    private $db;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    // Get or create wishlist for user
    private function getOrCreateWishlist($userId) {
        $query = "SELECT id FROM wishlist WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        $wishlist = $stmt->fetch();

        if (!$wishlist) {
            $query = "INSERT INTO wishlist (user_id) VALUES (:user_id)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            return $this->conn->lastInsertId($this->conn->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql' ? 'wishlist_id_seq' : null);
        }

        return $wishlist['id'];
    }

    // Get wishlist items
    public function getWishlist($userId) {
        try {
            $wishlistId = $this->getOrCreateWishlist($userId);

            $query = "SELECT wi.*, p.name, p.slug, p.price, p.image, p.stock, 
                            c.name as category_name
                     FROM wishlist_items wi
                     JOIN products p ON wi.product_id = p.id
                     LEFT JOIN categories c ON p.category_id = c.id
                     WHERE wi.wishlist_id = :wishlist_id
                     ORDER BY wi.created_at DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':wishlist_id', $wishlistId);
            $stmt->execute();

            $items = $stmt->fetchAll();

            return [
                'success' => true,
                'items' => $items
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching wishlist: ' . $e->getMessage()
            ];
        }
    }

    // Add item to wishlist
    public function addToWishlist($userId, $productId) {
        try {
            // Check if product exists
            $query = "SELECT id FROM products WHERE id = :product_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();

            if (!$stmt->fetch()) {
                return [
                    'success' => false,
                    'message' => 'Product not found'
                ];
            }

            $wishlistId = $this->getOrCreateWishlist($userId);

            // Check if already in wishlist
            $query = "SELECT id FROM wishlist_items 
                     WHERE wishlist_id = :wishlist_id AND product_id = :product_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':wishlist_id', $wishlistId);
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();

            if ($stmt->fetch()) {
                return [
                    'success' => false,
                    'message' => 'Product already in wishlist'
                ];
            }

            // Add to wishlist
            $query = "INSERT INTO wishlist_items (wishlist_id, product_id) 
                     VALUES (:wishlist_id, :product_id)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':wishlist_id', $wishlistId);
            $stmt->bindParam(':product_id', $productId);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Product added to wishlist'
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to add product to wishlist'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error adding to wishlist: ' . $e->getMessage()
            ];
        }
    }

    // Remove item from wishlist
    public function removeFromWishlist($userId, $productId) {
        try {
            $wishlistId = $this->getOrCreateWishlist($userId);

            $query = "DELETE FROM wishlist_items 
                     WHERE wishlist_id = :wishlist_id AND product_id = :product_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':wishlist_id', $wishlistId);
            $stmt->bindParam(':product_id', $productId);

            if ($stmt->execute()) {
                if ($stmt->rowCount() > 0) {
                    return [
                        'success' => true,
                        'message' => 'Product removed from wishlist'
                    ];
                }
                return [
                    'success' => false,
                    'message' => 'Product not found in wishlist'
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to remove product from wishlist'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error removing from wishlist: ' . $e->getMessage()
            ];
        }
    }

    // Check if product is in wishlist
    public function isInWishlist($userId, $productId) {
        try {
            $wishlistId = $this->getOrCreateWishlist($userId);

            $query = "SELECT id FROM wishlist_items 
                     WHERE wishlist_id = :wishlist_id AND product_id = :product_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':wishlist_id', $wishlistId);
            $stmt->bindParam(':product_id', $productId);
            $stmt->execute();

            return [
                'success' => true,
                'inWishlist' => $stmt->fetch() !== false
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error checking wishlist: ' . $e->getMessage()
            ];
        }
    }

    // Get wishlist count
    public function getWishlistCount($userId) {
        try {
            $wishlistId = $this->getOrCreateWishlist($userId);

            $query = "SELECT COUNT(*) as count FROM wishlist_items WHERE wishlist_id = :wishlist_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':wishlist_id', $wishlistId);
            $stmt->execute();
            $result = $stmt->fetch();

            return [
                'success' => true,
                'count' => $result['count']
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error getting wishlist count: ' . $e->getMessage()
            ];
        }
    }
}
