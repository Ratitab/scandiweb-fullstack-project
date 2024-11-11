<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php://stderr');
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Repositories\OrderRepository;
use Dotenv\Dotenv;
use App\Router\RouteHandler;
use App\Services\DatabaseService;
use App\Services\ProductService;
use DI\Container;
// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

try {
    // Create the DatabaseService instance
    $databaseService = new DatabaseService();


    // Ensure the DatabaseService returns a valid connection
    $pdoConnection = $databaseService->getConnection();


    $orderRepository = new OrderRepository($pdoConnection);
    // Create the ProductService instance using the PDO connection
    $productService = new ProductService($pdoConnection, $orderRepository);

    // ini_set('log_errors', 1);
    // ini_set('error_log', 'php://stderr');
    // error_log('Testing custom error log...');
    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);

    // error_reporting(E_ALL);
    error_log('Product service created');

    // Initialize and dispatch the route with ProductService
    $routeHandler = new RouteHandler($productService);
    $routeHandler->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
} catch (Exception $e) {
    // Handle any initialization errors
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
