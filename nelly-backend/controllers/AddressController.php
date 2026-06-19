<?php
require_once __DIR__ . '/../config/database.php';

class AddressController {
    private $conn;
    private $db;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->getConnection();
    }

    // Get all user addresses
    public function getAddresses($userId) {
        try {
            $query = "SELECT * FROM addresses 
                     WHERE user_id = :user_id 
                     ORDER BY is_default DESC, created_at DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();

            $addresses = $stmt->fetchAll();

            return [
                'success' => true,
                'addresses' => $addresses
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching addresses: ' . $e->getMessage()
            ];
        }
    }

    // Create new address
    public function createAddress($userId, $data) {
        try {
            // If this is set as default, unset other defaults
            if (isset($data['is_default']) && $data['is_default']) {
                $query = "UPDATE addresses SET is_default = FALSE WHERE user_id = :user_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->execute();
            }

            $query = "INSERT INTO addresses 
                     (user_id, address_type, full_name, phone, address_line1, address_line2, 
                      city, state, country, postal_code, is_default) 
                     VALUES 
                     (:user_id, :address_type, :full_name, :phone, :address_line1, :address_line2,
                      :city, :state, :country, :postal_code, :is_default)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':address_type', $data['address_type']);
            $stmt->bindParam(':full_name', $data['full_name']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':address_line1', $data['address_line1']);
            $stmt->bindParam(':address_line2', $data['address_line2']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':state', $data['state']);
            $stmt->bindParam(':country', $data['country']);
            $stmt->bindParam(':postal_code', $data['postal_code']);
            $isDefault = isset($data['is_default']) ? $data['is_default'] : false;
            $stmt->bindParam(':is_default', $isDefault, PDO::PARAM_BOOL);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Address added successfully',
                    'address_id' => $this->conn->lastInsertId()
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to add address'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error adding address: ' . $e->getMessage()
            ];
        }
    }

    // Update address
    public function updateAddress($userId, $addressId, $data) {
        try {
            // Verify address belongs to user
            $query = "SELECT id FROM addresses WHERE id = :address_id AND user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':address_id', $addressId);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();

            if (!$stmt->fetch()) {
                return [
                    'success' => false,
                    'message' => 'Address not found'
                ];
            }

            // If this is set as default, unset other defaults
            if (isset($data['is_default']) && $data['is_default']) {
                $query = "UPDATE addresses SET is_default = FALSE WHERE user_id = :user_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->execute();
            }

            $query = "UPDATE addresses SET 
                     address_type = :address_type,
                     full_name = :full_name,
                     phone = :phone,
                     address_line1 = :address_line1,
                     address_line2 = :address_line2,
                     city = :city,
                     state = :state,
                     country = :country,
                     postal_code = :postal_code,
                     is_default = :is_default
                     WHERE id = :address_id AND user_id = :user_id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':address_type', $data['address_type']);
            $stmt->bindParam(':full_name', $data['full_name']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':address_line1', $data['address_line1']);
            $stmt->bindParam(':address_line2', $data['address_line2']);
            $stmt->bindParam(':city', $data['city']);
            $stmt->bindParam(':state', $data['state']);
            $stmt->bindParam(':country', $data['country']);
            $stmt->bindParam(':postal_code', $data['postal_code']);
            $isDefault = isset($data['is_default']) ? $data['is_default'] : false;
            $stmt->bindParam(':is_default', $isDefault, PDO::PARAM_BOOL);
            $stmt->bindParam(':address_id', $addressId);
            $stmt->bindParam(':user_id', $userId);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Address updated successfully'
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to update address'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating address: ' . $e->getMessage()
            ];
        }
    }

    // Delete address
    public function deleteAddress($userId, $addressId) {
        try {
            $query = "DELETE FROM addresses WHERE id = :address_id AND user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':address_id', $addressId);
            $stmt->bindParam(':user_id', $userId);

            if ($stmt->execute()) {
                if ($stmt->rowCount() > 0) {
                    return [
                        'success' => true,
                        'message' => 'Address deleted successfully'
                    ];
                }
                return [
                    'success' => false,
                    'message' => 'Address not found'
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to delete address'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error deleting address: ' . $e->getMessage()
            ];
        }
    }

    // Set default address
    public function setDefaultAddress($userId, $addressId) {
        try {
            // Verify address belongs to user
            $query = "SELECT id FROM addresses WHERE id = :address_id AND user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':address_id', $addressId);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();

            if (!$stmt->fetch()) {
                return [
                    'success' => false,
                    'message' => 'Address not found'
                ];
            }

            // Unset all defaults
            $query = "UPDATE addresses SET is_default = FALSE WHERE user_id = :user_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();

            // Set new default
            $query = "UPDATE addresses SET is_default = TRUE WHERE id = :address_id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':address_id', $addressId);

            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Default address updated'
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to set default address'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error setting default address: ' . $e->getMessage()
            ];
        }
    }
}
