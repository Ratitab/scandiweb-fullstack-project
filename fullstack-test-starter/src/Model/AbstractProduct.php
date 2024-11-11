<?php

namespace App\Model;

abstract class AbstractProduct {
    protected $id;
    protected $name;
    protected $inStock;
    protected $description;
    protected $brand;
    protected $categoryName;

    public function __construct($id, $name, $inStock, $description, $brand, $categoryName)
    {
        $this->id = $id;
        $this->name = $name;
        $this->inStock = $inStock;
        $this->description = $description;
        $this->brand = $brand;
        $this->categoryName = $categoryName;
    }

    abstract public function getDetails();
    
    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }
    
}
