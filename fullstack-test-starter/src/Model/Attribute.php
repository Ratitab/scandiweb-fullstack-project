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
        return array_map(function($item) {
            return [
                'display_value' => $item['display_value'],
                'value' => $item['value']
            ];
        }, $this->items);
    }

    public function toArray() {
        return parent::toArray();
    }
}
