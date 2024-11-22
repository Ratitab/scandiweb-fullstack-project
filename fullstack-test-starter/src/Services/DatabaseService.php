<?php
namespace App\Services;

use PDO;
use PDOException;

class DatabaseService  extends AbstractDatabaseService {
    protected $connection;

    public function __construct()
    {
        $this->initilizeConnection();
    }

    protected function initilizeConnection()
    {
        $dbHost = $_ENV['DB_HOST'] ?: die('DB_HOST not set.');
        $dbPort = $_ENV['DB_PORT'] ?: die('DB_PORT not set.');
        // $dbSocket = $_ENV['DB_SOCKET'] ?: die('DB_SOCKET not set.');
        $dbName = $_ENV['DB_NAME'] ?: die('DB_NAME not set.');
        $username = $_ENV['DB_USER'] ?: die('DB_USER not set.');
        $password = $_ENV['DB_PASS'] ?: die('DB_PASS not set.');
    
        try {
            $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName}";
            $this->connection = new PDO($dsn, $username, $password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("DATABASE CONNECTION FAILED: " . $e->getMessage());
        }
    }

    public function getConnection() {
        return $this->connection;
    }
}


?>