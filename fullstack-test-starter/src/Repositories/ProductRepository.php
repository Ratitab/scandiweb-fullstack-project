<?php

namespace App\Repositories;

use RuntimeException;

class ProductRepository extends AbstractRepository {
    public function fetchProductDetails() {
        $query = "
         SELECT 
    p.id,
    p.name,
    p.in_stock,
    p.description,
    p.brand,
    c.name AS category_name,
    GROUP_CONCAT(DISTINCT img.image_url ORDER BY img.image_url SEPARATOR '|') AS image_gallery,
    pr.amount AS price,
    cur.symbol AS currency_symbol
FROM 
    products p
LEFT JOIN 
    categories c ON p.category_id = c.id
LEFT JOIN 
    product_gallery img ON p.id = img.product_id
LEFT JOIN 
    prices pr ON p.id = pr.product_id
LEFT JOIN 
    currencies cur ON pr.currency_id = cur.id
GROUP BY 
    p.id, pr.amount, cur.symbol;
    ";

    $stmt = $this->db->query($query);
    $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    if (!$result) {
        return [];
    }


    return $result;

    }



    public function FetchPDPDetails($id) {
        $query = "
            SELECT 
                p.id,
                p.name,
                p.in_stock,
                p.description,
                p.brand,
                c.name AS category_name,
                GROUP_CONCAT(DISTINCT img.image_url ORDER BY img.image_url SEPARATOR '|') AS image_gallery,
                pa.name AS attribute_name,
                pa.type AS attribute_type,
                GROUP_CONCAT(DISTINCT CONCAT(ai.display_value, '|', ai.value) ORDER BY ai.display_value SEPARATOR ',') AS attribute_items,
                pr.amount AS price_amount,
                cur.label AS currency_label,
                cur.symbol AS currency_symbol
            FROM 
                products p
            LEFT JOIN 
                categories c ON p.category_id = c.id
            LEFT JOIN 
                product_gallery img ON p.id = img.product_id
            LEFT JOIN 
                product_attributes pa ON p.id = pa.product_id
            LEFT JOIN 
                attribute_items ai ON pa.id = ai.attribute_id
            LEFT JOIN 
                prices pr ON p.id = pr.product_id
            LEFT JOIN 
                currencies cur ON pr.currency_id = cur.id
            WHERE 
                p.id = :id
            GROUP BY 
                p.id, pa.name, pa.type, pr.amount, cur.label, cur.symbol;
        ";
        
        $stmt = $this->db->prepare($query);
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        // error_log("ES ARI PDP DETAILSI" . $result);

        if (!$result) {
            throw new RuntimeException("no data found for provided id");
        }

        return $result;
    }
}


?>