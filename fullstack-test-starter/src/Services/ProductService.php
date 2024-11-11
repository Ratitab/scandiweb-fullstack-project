<?php

namespace App\Services;

use App\Model\Product;
use App\Model\Attribute;
use App\Repositories\OrderRepository;
// use App\Repositories\Repositories;
use PDOException;
use RuntimeException;

class ProductService {
    private $connection;
    private $orderRepository;

    public function __construct(\PDO $connection, OrderRepository $orderRepository)
    {
        $this->connection = $connection;
        $this->orderRepository = $orderRepository;
    }


    public function fetchPDPDetails($id) {

        try {
            $stmt = $this->connection->prepare("
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
        ");
        $stmt->execute(['id' => $id]);
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (!$rows) {
            throw new RuntimeException("No data found for the provided product ID.");
        }
        
        // Initialize the result
        $result = [
            'id' => $rows[0]['id'],
            'name' => $rows[0]['name'],
            'in_stock' => $rows[0]['in_stock'],
            'description' => $rows[0]['description'],
            'brand' => $rows[0]['brand'],
            'category_name' => $rows[0]['category_name'],
            'image_gallery' => explode(',', $rows[0]['image_gallery']),
            'attributes' => [],
            'price' => [
                'amount' => $rows[0]['price_amount'],
                'currency_label' => $rows[0]['currency_label'],
                'currency_symbol' => $rows[0]['currency_symbol']
            ]
        ];

        error_log("Creating Product with the following data:");
error_log("ID: " . $rows[0]['id']);
error_log("Name: " . $rows[0]['name']);
error_log("Image Gallery: " . json_encode(explode(',', $rows[0]['image_gallery'])));
error_log("Price Data: " . json_encode([
    'amount' => $rows[0]['price_amount'],
    'currency_label' => $rows[0]['currency_label'],
    'currency_symbol' => $rows[0]['currency_symbol']
]));


        $product = new Product(
            $rows[0]['id'],
            $rows[0]['name'],
            $rows[0]['in_stock'],
            $rows[0]['description'],
            $rows[0]['brand'],
            $rows[0]['category_name'],
            explode('|', $rows[0]['image_gallery']),
            $this->createAttributes($rows),
            [
                'amount' => $rows[0]['price_amount'],
                'currency_label' => $rows[0]['currency_label'],
                'currency_symbol' => $rows[0]['currency_symbol']
            ]
        );
        error_log("Fetched result: " );
        
        // Process attributes
      
                error_log("Fetched result: " . json_encode($result));
                return $product->getDetails();
        } catch(\PDOException $e) {
            throw new RuntimeException("error fetching PDP detials: " . $e->getMessage());
        }
    }

    public function insertOrder ($orderId , $price, $orderItems) {


        try {
 
            // $stmt = $this->connection->prepare("
            // INSERT INTO orders (orderId, price, data)
            // values (:orderId, :price, :data)
            //     ");           
            // $stmt->execute([
            //     'orderId' => $orderId,
            //     'price' => 564.33,
            //     'data' => $data,
            // ]);

            $totalPrice = 0;

            $data = json_encode(["items" => $orderItems]);
    
            foreach($orderItems as $item) {
                $price = $this->orderRepository->findProductPriceById($item['productId']);
                $itemTotal = $price * $item['quantity'];
                $totalPrice += $itemTotal;
            };
    
            $this->orderRepository->insertOrder($orderId,$totalPrice,$data);

            return true;
        } catch (PDOException $err) {
            echo "SHEMOIDAA??";            
            error_log("Error inserting order: " . $err->getMessage());
            throw new RuntimeException("Error insering in ordews " . $err->getMessage());
        }
    }
 
    public function fetchAllCategories() {
        try {
            error_log('ARIKAA - Starting category query...');
            $stmt = $this->connection->query("SELECT name FROM categories");
    
            error_log('Query executed successfully.');
    
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return $result;
        } catch (PDOException $e) {
            error_log('Database error: ' . $e->getMessage());
            throw new RuntimeException('Error fetching categories: ' . $e->getMessage());
        }
    }


    // public function fetchGategories () {
    //     try {
    //         $data = $this->;
    //     }
    // }

    public function fetchProductDetails() {
        try {
            error_log('Fetching product details - starting query execution');
    
            $stmt = $this->connection->query("
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
            ");
    
            error_log('Query executed successfully');
            $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    
            if (!$result) {
                error_log('No data found or empty result set.');
                return [];
            }
    
            // Process each product to transform the image gallery into an array
            // foreach ($result as &$product) {
            //     $product['image_gallery'] = !empty($product['image_gallery']) 
            //         ? explode(',', $product['image_gallery']) 
            //         : []; // Convert to empty array if no images
            // }
    
            error_log('Fetched product details: ' . json_encode($result));
            return $result;
    
        } catch (PDOException $e) {
            error_log('Database error: ' . $e->getMessage());
            throw new RuntimeException("Error fetching product details: " . $e->getMessage());
        }
    }
    

    private function createAttributes($rows)
    {
        $attributes = [];
        foreach ($rows as $row) {
            error_log("Processing row for attributes: " . json_encode($row));
            if ($row['attribute_name']) {
                $items = [];
                $attributeItems = explode(',', $row['attribute_items']);
                foreach ($attributeItems as $item) {
                    if (strpos($item, '|') !== false) {
                        list($displayValue, $value) = explode('|', $item);
                        $items[] = [
                            'display_value' => $displayValue,
                            'value' => $value
                        ];
                    } else {
                        error_log("Invalid attribute item format: " . $item);
                    }
                }
    

                $attribute = new Attribute($row['attribute_name'], $row['attribute_type'], $items);
                $attributes[] = $attribute->toArray(); 
            } else {
                error_log("No attribute_name found in row: " . json_encode($row));
            }
        }
    
        // Log the generated attributes for debugging
        error_log("Generated attributes: " . json_encode($attributes));
    
        return $attributes;
    }
    

}

