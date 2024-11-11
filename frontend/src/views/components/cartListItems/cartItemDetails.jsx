import React, { Component } from "react";

class CartItemDetails extends Component {

  handleSelectedAttributes = (attributeName, itemValue) => {
    const { setSelectedAttributes } = this.props
    console.log("[ATTRIBUTE]", attributeName, itemValue)
    setSelectedAttributes(attributeName, itemValue)
  }

  render() {
    const { name, price, attributes, selectedAttributes, cart } = this.props;
    return (
      <div className="flex flex-col justify-between">
        <div className="font-thin text-xl">{name}</div>

        <div className="my-2">
        <h2 className="mb-2 font-thin text-sm">PRICE:</h2>
          <h2 className="font-medium text-lg">${price}</h2></div>

        {/* Map through attributes */}
        {cart && attributes &&  
          attributes.map((attribute) => (
            <div key={attribute.name}>
              <h4 className="font-thin tracking-wide text-sm">{attribute.name.toUpperCase()}:</h4>
              <div className="flex gap-2 mt-2">
                {attribute.items.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => this.handleSelectedAttributes(attribute.name, item.value)}
                    className={`px-2 py-1 inline-flex items-center justify-center text-xs ${
                      selectedAttributes[attribute.name]?.value === item.value
                        ? "bg-black text-white"
                        : "bg-white text-black border border-gray-600"
                    }`}
                    style={
                      attribute.name === "Color"
                        ? { backgroundColor: item.value, width: "18px", height: "18px" }
                        : {}
                    }
                  >
                    {attribute.name === "Color" ? "" : item.value}
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default CartItemDetails;