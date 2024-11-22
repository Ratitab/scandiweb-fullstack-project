<?php

use DI\ContainerBuilder;
use App\Services\DatabaseService;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use App\Repositories\CategoryRepository;
use App\Services\ProductService;
use App\Services\RedisService;

$containerBuilder = new ContainerBuilder();

$containerBuilder->addDefinitions([
    // Register DatabaseService as a shared service
    DatabaseService::class => DI\create(DatabaseService::class),

    RedisService::class => DI\create(RedisService::class),

    // Register repositories and inject DatabaseService where required
    OrderRepository::class => DI\autowire()->constructor(DI\get(DatabaseService::class)),
    ProductRepository::class => DI\autowire()->constructor(DI\get(DatabaseService::class)),
    CategoryRepository::class => DI\autowire()->constructor(DI\get(DatabaseService::class)),

    // Register ProductService with the repositories as dependencies
    ProductService::class => DI\autowire()
        ->constructor(DI\get(ProductRepository::class), DI\get(OrderRepository::class), DI\get(CategoryRepository::class)),
]);

return $containerBuilder->build();
