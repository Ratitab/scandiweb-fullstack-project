<?php

namespace App\Repositories;

use PDO;
use RuntimeException;

class OrderRepository {
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }


    public function findProductPriceById($productId) {
        $query = "select amount from prices where product_id in (:productId)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':productId', $productId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            error_log("ARIKA DEVIWVIT");
            throw new RuntimeException("ARIKA DEVIWVIT");
        }


        return (float) $result['amount'];
    }


    public function insertOrder($orderId,$totalPrice,$orderItems) {
        $query = "INSERT INTO orders (orderId, price, data) values (:orderId, :price, :data)";
        $stmt = $this->db->prepare($query);
        $data = json_encode(["items" => $orderItems]);
        $stmt->bindParam(':orderId', $orderId);
        $stmt->bindParam(':price', $totalPrice);
        $stmt->bindParam(':data', $data);
        $stmt->execute();

        return true;
    }
}


?>