<?php

namespace App\Controller;

use App\Services\ProductService;
use Exception;
use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\Definition\InputObjectType;
use RuntimeException;
use Throwable;

use function PHPSTORM_META\type;

class GraphQL
{
    private $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
        error_log('ProductService injected into GraphQL class');
    }

    public function resolvePDPDetails($id) {
        try {
            error_log("AK raxdena");
            $data = $this->productService->fetchPDPDetails($id);

            

            return $data;
        } catch (\Exception $e) {
            throw new RuntimeException("Error fetgin products from Service" . $e->getMessage());
        }
    }

    // Instance method for productDetails resolver
    public function resolveProductDetails($root, $args) {
        try {

            $products = $this->productService->fetchProductDetails();

            
            $resolvedProducts = array_map(function($product) {
                if (is_string($product['image_gallery'])) {
                    $product['image_gallery'] = explode('|', $product['image_gallery']);
                } elseif (!is_array($product['image_gallery'])) {
                    $product['image_gallery'] = [];
                }
                return $product;
            }, $products);
    
            return $resolvedProducts;
        } catch (Exception $e) {
            error_log('Error in resolveProductDetails: ' . $e->getMessage());
            throw new RuntimeException('Error resolveProductDetails: ' . $e->getMessage());
        }
    }

    public function resolveCategories() {
        try {
            $data = $this->productService->fetchAllCategories();
            return $data;
        } catch (Exception $e) {
            throw new RuntimeException("error fetching categories " . $e->getMessage());
        }
    }

    public function resolvePlaceOrder($root, $args) {

        try {
            error_log("LIJBI RESOLVERSHI SHEMOVIDES ES NABOZARI MERE SAD WAVA");
            $orderItems = $args['orderItems'];
            // $price = $args['totalPrice'];
            $orderId = str_pad(mt_rand(0,999999), 6, '0', STR_PAD_LEFT);
            error_log("Received data: " . json_encode($orderItems)  );

            $this->productService->insertOrder($orderId,544.22, $orderItems);
            return  [
                'orderId' => "123456",
                'status' => "SUCCESS",
                'message' => 'order placed successfully'
            ];
            error_log("Order placed successfully with Order ID: ARIKAAA" . $orderId);
    
            // Log each item for clarity
            foreach ($orderItems as $item) {
                error_log("Product ID: " . $item['productId']);
                error_log("Quantity: " . $item['quantity']);
                error_log("Attributes: " . json_encode($item['selectedAttributes']));
            }
    
            return ;
        } catch (Exception $e) {
            echo "RAMEE";
            error_log("Error in resolvePlaceOrder: " . $e->getMessage());
            throw new RuntimeException("Error placing order: " . $e->getMessage());
        }
    }
    


    // Ensure this method is NOT static
    public function handle()
    {
        try {
            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'echo' => [
                        'type' => Type::string(),
                        'args' => [
                            'message' => ['type' => Type::string()],
                        ],
                        'resolve' => fn($rootValue, array $args) => $rootValue['prefix'] . $args['message'],
                    ],
                    'productDetails' => [
                        'type' => Type::listOf(
                            new ObjectType([
                                'name' => 'ProductDetail',
                                'fields' => [
                                    'id' => Type::string(),
                                    'name' => Type::string(),
                                    'in_stock' => Type::boolean(),
                                    'description' => Type::string(),
                                    'brand' => Type::string(),
                                    'category_name' => Type::string(),
                                    'image_gallery' => Type::listOf(Type::string()),
                                    'price' => Type::float(),
                                    'currency_label' => Type::string(),
                                    'currency_symbol' => Type::string(),
                                ],
                            ])
                        ),
                        'resolve' => [$this, 'resolveProductDetails'], // Use instance method as resolver
                    ],
                    'categories' => [
                        'type' => Type::listOf(
                            new ObjectType([
                                'name' => "Category",
                                'fields' => [
                                    'name' => Type::string(),
                                ],
                            ])
                        ),
                        'resolve' => [$this, 'resolveCategories'], // Ensure this is inside the 'categories' field
                    ],
                    'PDP' => [
                        'type' => new ObjectType([
                            'name' => 'PDP',
                            'fields' => [
                                'id' => Type::string(),
                                'name' => Type::string(),
                                'in_stock' => Type::boolean(),
                                'description' => Type::string(),
                                'brand' => Type::string(),
                                'category_name' => Type::string(),
                                'image_gallery' => Type::listOf(Type::string()),
                                'attributes' => Type::listOf(
                                    new ObjectType([
                                        'name' => 'Attribute',
                                        'fields' => [
                                            'name' => Type::string(),
                                            'type' => Type::string(),
                                            'items' => Type::listOf(
                                                new ObjectType([
                                                    'name' => 'AttributeItem',
                                                    'fields' => [
                                                        'display_value' => Type::string(),
                                                        'value' => Type::string(),
                                                    ],
                                                ])
                                            ),
                                        ],
                                    ])
                                ),
                                'price' => new ObjectType([
                                    'name' => 'Price',
                                    'fields' => [
                                        'amount' => Type::float(),
                                        'currency_label' => Type::string(),
                                        'currency_symbol' => Type::string(),
                                    ],
                                ]),
                            ],
                        ]),
                        'args' => [
                            'id' => ['type' => Type::nonNull(Type::string())],
                        ],
                        'resolve' => function ($root, $args) {
                            return $this->resolvePDPDetails($args['id']);
                        },
                    ],
                ],
            ]);

            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'placeOrder' => [
                        'type' => new ObjectType([
                            'name' => 'PlaceOrderResponse',
                            'fields' => [
                                'orderId' => Type::string(),
                                'status' => Type::string(),
                                'message' => Type::string(),
                            ]
                        ]),
                        'args' => [
                            'orderItems' => Type::listOf(
                                new InputObjectType([
                                    'name' => 'OrderItemInput',
                                    'fields' => [
                                        'productId' => Type::string(),
                                        'quantity' => Type::int(),
                                        'selectedAttributes' => Type::listOf(
                                            new InputObjectType([
                                                'name' => 'SelectedAttributeInput',
                                                'fields' => [
                                                    'name' => Type::string(),
                                                    'value' => Type::string(),
                                                ]
                                            ])
                                        ),
                                    ],
                                ])
                            ),
                        ],
                        'resolve' => [$this, 'resolvePlaceOrder'],
                    ],
                ],
            ]);
            

            $schema = new Schema([
                'query' => $queryType,
                'mutation' => $mutationType,
            ]);

            $rawInput = file_get_contents('php://input');
            error_log('Raw input: ' . $rawInput);
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'] ?? null;
            $variableValues = $input['variables'] ?? null;

            $rootValue = ['prefix' => 'You said: '];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            error_log('GraphQL internal error: ' . $e->getMessage());
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        return json_encode($output);
    }
}