<?php

namespace App\Model;

class Attribute extends AbstractAttribute {
    private $items;

    public function __construct($name, $type, $items)
    {
        parent::__construct($name, $type);
        $this->items = $items;
    }

    public function getAttributeItems()
    {
        return $this->items;
    }

    public function toArray() {
        return array_merge(parent::toArray(), [
            'items' => $this->items
        ]);
    }
}
