<?php

namespace App\Repositories;

use App\Model\AbstractProduct;
use App\Services\DatabaseService;
use PDO;
use RuntimeException;

class OrderRepository  extends AbstractRepository{
    public function findProductPriceById($productId) {
        $query = "select amount from prices where product_id in (:productId)";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':productId', $productId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
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