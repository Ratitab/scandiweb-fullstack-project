<?php

namespace App\Model;

class Product extends AbstractProduct {
    private array $imageGallery;
    private $attributes;
    private $price;

    public function __construct($id, $name, $inStock, $description, $brand, $categoryName, $imageGallery, $attributes, $price)
    {
        parent::__construct($id, $name, $inStock, $description, $brand, $categoryName);
        $this->imageGallery = is_string($imageGallery)
        ? explode('|', $imageGallery)
        : (array) $imageGallery;
        $this->attributes = $attributes;
        $this->price = $price;

    }

    public function getDetails()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'in_stock' => $this->inStock,
            'description' => $this->description,
            'brand' => $this->brand,
            'category_name' => $this->categoryName,
            'image_gallery' => $this->imageGallery,
            'attributes' => $this->attributes,
            'price' => $this->price
        ];
    }

}
