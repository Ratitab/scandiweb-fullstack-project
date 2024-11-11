<?php

namespace App\Repositories;

class CategoryRepository extends AbstractRepository {
    public function fetchAllCategories() {
        $query = "select name from categories";
        $stmt = $this->db->query($query);

        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (!$result) {
            throw new \RuntimeException("No categories found.");
        }

        return $result;
    }
}


?>