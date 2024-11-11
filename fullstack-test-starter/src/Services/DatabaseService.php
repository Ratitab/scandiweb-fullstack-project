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
        $dbSocket = $_ENV['DB_SOCKET'] ?: die('DB_SOCKET not set.');
        $dbName = $_ENV['DB_NAME'] ?: die('DB_NAME not set.');
        $username = $_ENV['DB_USER'] ?: die('DB_USER not set.');
        $password = $_ENV['DB_PASS'] ?: die('DB_PASS not set.');
    
        try {
            $this->connection = new PDO(
                "mysql:unix_socket={$dbSocket};dbname={$dbName}",
                $username,
                $password
            );
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