<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Router\RouteHandler;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

try {
    // Load the PHP-DI container
    $container = require __DIR__ . '/../container.php';

    // Get the ProductService and RouteHandler from the container
    $productService = $container->get(App\Services\ProductService::class);
    $routeHandler = new RouteHandler($productService);

    // Dispatch the route
    $routeHandler->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
