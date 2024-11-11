<?php

namespace App\Controller;

use App\Services\DatabaseService;

class TestController
{
    private $dbService;

    public function __construct()
    {
        $this->dbService = new DatabaseService();
    }

    public function checkConnection()
    {
        try {
            $connection = $this->dbService->getConnection();
            $stmt = $connection->query('SELECT 1');

            if ($stmt !== false) {
                return json_encode(["status" => "success", "message" => "Connected to MySQL successfully!"]);
            } else {
                return json_encode(["status" => "error", "message" => "Test query failed."]);
            }
        } catch (\PDOException $e) {
            return json_encode(["status" => "error", "message" => "Error verifying database connection: " . $e->getMessage()]);
        }
    }
}
