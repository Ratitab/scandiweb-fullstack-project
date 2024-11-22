<?php 

namespace App\Services;

use Exception;
use Predis\Client;
use RuntimeException;

class RedisService {
    private Client $client;

    public function __construct()
    {
        $this->initilizeConnection();
    }

    private function initilizeConnection() {
        $host = $_ENV['REDIS_HOST'] ?? '127.0.0.1';
        $port = $_ENV["REDIS_PORT"] ?? 6379;
        $password = $_ENV['REDIS_PASSWORD'] ?? null;


        $parameters = [
            'schema' => 'tcp',
            'host' => $host,
            'port' => $port,
        ];

        if (!empty($password)) {
            $parameters['password'] = $password;
        }

        try {
            $this->client = new Client($parameters);
        } catch (Exception $e) {
            error_log("FAILEDEEEEEE");
            throw new RuntimeException("FAILED TO CONNECT TO REDIS: " . $e->getMessage());
        }
    }



    public function getClient(): Client
    {
        return $this->client;
    }

    public function set(string $key, string $value, int $ttl = 3600): bool
    {
        try {
            $this->client->setex($key, $ttl, $value);
            return true;
        } catch (\Exception $e) {
            error_log("Redis SET Error: " . $e->getMessage());
            return false;
        }
    }

    public function get(string $key): ?string
    {
        try {
            $value = $this->client->get($key);
            return $value !== null ? $value : null;
        } catch (\Exception $e) {
            error_log("Redis GET Error: " . $e->getMessage());
            return null;
        }
    }

    public function delete(string $key): bool
    {
        try {
            return $this->client->del([$key]) > 0;
        } catch (\Exception $e) {
            return false;
        }
    }
}