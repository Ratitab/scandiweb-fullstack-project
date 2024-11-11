<?php
namespace App\Services;

use RuntimeException;

abstract class AbstractDatabaseService {
    protected $connection;

    public function getConnection() {
        if ($this->connection === null) {
            throw new \RuntimeException("Database connection is false");
        }

        return $this->connection;
    }

    abstract protected function initilizeConnection();

    public function logConnection() {
        if ($this->connection) {
            error_log("Database conn niceee");
        } else {
            error_log("Db connection baadd");
        }
    }
}

?>