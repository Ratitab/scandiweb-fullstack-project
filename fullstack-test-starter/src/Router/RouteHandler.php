<?php

namespace App\Router;

use FastRoute\RouteCollector;
use FastRoute\Dispatcher;
use App\Controller\TestController; // Import the correct namespace
use App\Controller\GraphQL;
use App\Services\DatabaseService;
use App\Services\ProductService;

class RouteHandler
{
    private $dispatcher;
    private $productService;

    public function __construct(ProductService $productService )
    {
        $this->productService = $productService;
        $this->dispatcher = \FastRoute\simpleDispatcher(function (RouteCollector $r) {
            $r->get('/test-connection', [TestController::class, 'checkConnection']);
            $r->post('/graphql', [GraphQL::class, 'handle']);
        });
    }

    public function dispatch($method, $uri)
    {
        header("Access-Control-Allow-Origin: *"); 
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true"); 

    if ($method === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    
        $routeInfo = $this->dispatcher->dispatch($method, $uri);

        switch ($routeInfo[0]) {
            case Dispatcher::NOT_FOUND:
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "404 Not Found"]);
                break;
            case Dispatcher::METHOD_NOT_ALLOWED:
                http_response_code(405);
                echo json_encode(["status" => "error", "message" => "405 Method Not Allowed"]);
                break;
            case Dispatcher::FOUND:
                $handler = $routeInfo[1];
                $vars = $routeInfo[2];



                if (is_array($handler)) {
                    $controller = new $handler[0]($this->productService);
                    $method = $handler[1];

                    if (method_exists($controller, $method)) {
                        header('Content-Type: application/json');
                        echo $controller->$method($vars);
                    } else {
                        http_response_code(500);
                        echo json_encode(["status" => "error", "message" => "Handler method not found."]);
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(["status" => "error", "message" => "Handler not callable."]);
                }
                break;
        }
    }
}
