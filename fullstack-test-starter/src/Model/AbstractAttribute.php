<?php

namespace App\Model;

abstract class AbstractAttribute {
    protected $name;
    protected $type;

    public function __construct($name, $type)
    {
        $this->name = $name;
        $this->type = $type;
    }

    abstract public function getAttributeItems();

    public function getName() {
        return $this->name;
    }

    public function getType() {
        return $this->type;
    }

    // Convert object properties to an array for JSON encoding
    public function toArray() {
        return [
            'name' => $this->name,
            'type' => $this->type
        ];
    }
}
