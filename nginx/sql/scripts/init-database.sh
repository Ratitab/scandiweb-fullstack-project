#!/bin/bash

echo "Starting MySQL database initialization..."

# Import SQL files in order
sql_files=(
    "/docker-entrypoint-initdb.d/scandiweb_ecommerce_categories.sql"
    "/docker-entrypoint-initdb.d/scandiweb_ecommerce_currencies.sql"
    "/docker-entrypoint-initdb.d/scandiweb_ecommerce_products.sql"
    "/docker-entrypoint-initdb.d/scandiweb_ecommerce_product_gallery.sql"
    "/docker-entrypoint-initdb.d/scandiweb_ecommerce_product_attributes.sql"
    "/docker-entrypoint-initdb.d/scandiweb_ecommerce_attribute_items.sql"
    "/docker-entrypoint-initdb.d/scandiweb_ecommerce_prices.sql"
    "/docker-entrypoint-initdb.d/scandiweb_ecommerce_orders.sql"
)

for file in "${sql_files[@]}"; do
    if [ -f "$file" ]; then
        echo "Importing $file..."
        mysql -u root -p"xutjerA@0098" scandiweb_ecommerce < "$file"
    else
        echo "File $file not found. Skipping..."
    fi
done

echo "MySQL database initialization completed."
