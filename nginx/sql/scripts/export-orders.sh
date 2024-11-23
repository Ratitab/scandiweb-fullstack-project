#!/bin/bash

echo "Exporting orders table..."

# Export orders table to the SQL file
mysqldump -u root -pxutjerA@0098 scandiweb_ecommerce orders > /docker-entrypoint-initdb.d/scandiweb_ecommerce_orders.sql

echo "Orders table exported successfully."
