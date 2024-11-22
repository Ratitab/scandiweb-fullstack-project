<?php
try {
    $pdo = new PDO('mysql:host=mysql;dbname=scandiweb_ecommerce', 'root', 'xutjerA@0098');
    foreach ($pdo->query('SHOW TABLES') as $row) {
        print_r($row);
    }
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
?>
