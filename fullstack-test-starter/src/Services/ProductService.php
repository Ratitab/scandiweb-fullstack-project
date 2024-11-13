<?php

namespace App\Services;

use App\Model\Product;
use App\Model\Attribute;
use App\Repositories\CategoryRepository;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
// use App\Repositories\Repositories;
use PDOException;
use RuntimeException;

class ProductService {
    private $orderRepository;
    private $productRepository;
    private $categoryRepository;

    public function __construct(
        ProductRepository $productRepository,
        OrderRepository $orderRepository,
        CategoryRepository $categoryRepository
    ) {
        $this->productRepository = $productRepository;
        $this->orderRepository = $orderRepository;
        $this->categoryRepository = $categoryRepository;
    }


    public function fetchPDPDetails($id) {

        try {
        $rows = $this->productRepository->fetchPDPDetails($id);
        
        $result = [
            'id' => $rows[0]['id'],
            'name' => $rows[0]['name'],
            'in_stock' => $rows[0]['in_stock'],
            'description' => $rows[0]['description'],
            'brand' => $rows[0]['brand'],
            'category_name' => $rows[0]['category_name'],
            'image_gallery' => explode('|', $rows[0]['image_gallery']),
            'price' => [
                'amount' => $rows[0]['price_amount'],
                'currency_label' => $rows[0]['currency_label'],
                'currency_symbol' => $rows[0]['currency_symbol']
            ]
            ];
      
                return $result;
        } catch(\PDOException $e) {
            throw new RuntimeException("error fetching PDP detials: " . $e->getMessage());
        }
    }

    public function insertOrder ($orderId , $price, $orderItems) {
        try {

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
            throw new RuntimeException("Error insering in ordews " . $err->getMessage());
        }
    }
 
    public function fetchAllCategories() {
        $data = $this->categoryRepository->fetchAllCategories();

        return $data;
    }

    public function fetchProductDetails() {
        $data = $this->productRepository->fetchProductDetails();
        // error_log("PRICEBIIIIIIIIIIIIIIIIII" . json_encode($data));
        return $data;
    }

    public function fetchAttributesQuickShop ($id) {
        $data = $this->productRepository->fetchAttributesByProductId($id);
        return $data;
    }
    
    public function resolveAttributes($id) {
        $rows = $this->productRepository->fetchAttributesByProductId($id);
        $attributes = $this->createAttributes($rows);
        return $attributes;
    }

    private function createAttributes($rows)
    {
        $attributes = [];
        foreach ($rows as $row) {
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
    
    
        return $attributes;
    }
    

}

