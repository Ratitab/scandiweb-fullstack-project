<?php
namespace App\Repositories;

use App\Services\DatabaseService;

abstract class AbstractRepository {
    protected \PDO $db;

    public function __construct(DatabaseService $databaseService)
    {
        $this->db = $databaseService->getConnection();
    }


    
}


?>