import React, { Component } from "react";
import CartItemDetails from "./cartItemDetails";
import { withCart } from "../../../context/cartContext";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: props.sizes ? props.sizes[0] : "M",
      color: props.colors ? props.colors[0] : "#000000",
      selectedAttributes: props.selectedAttributes || {},
      counter: 0,
    };
  }

  incrementCounter = () => {
    const {incrementQuantity, id, selectedAttributes} = this.props
    console.log(id)
    incrementQuantity(id, selectedAttributes)
  };

  decrementCounter = () => {
    const {decrementQuantity, id, selectedAttributes, quantity} = this.props
    if (quantity === 1) {
      this.props.removeFromCart(id, selectedAttributes)
    } else {
      decrementQuantity(id, selectedAttributes)
    }
  };

  setSize = (size) => {
    this.setState({ size });
  };

  setColor = (color) => {
    this.setState({ color });
  };

  setSelectedAttributes = (attributeName, value) => {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeName]: { value },
      },
    }));
  };

  render() {
    const { name, price, quantity,image, attributes,cart } = this.props;
    const { selectedAttributes } = this.state;
    console.log("[CART  attributes IN CARITEM]",quantity)
    return (
      <div className="flex my-10 justify-between  h-full">
        <div className="flex justify-between w-full mr-4">

        <CartItemDetails
          name={name}
          price={price}
          setSize={this.setSize}
          setColor={this.setColor}
          setSelectedAttributes={this.setSelectedAttributes}
          selectedAttributes={selectedAttributes}
          attributes={attributes}
          cart={cart}
        />
        <div className="flex flex-col justify-between h-full">
          <button
            onClick={this.incrementCounter}
            className=" w-6 h-6 text-lg flex items-center justify-center border border-gray-800"
          >
            +
          </button>
          <p className=" text-center h-fit flex justify-center items-center">{quantity}</p>
          <button
            className="w-6 h-6 text-lg flex items-center justify-center border border-gray-800 "
            onClick={this.decrementCounter}
            disabled={quantity === 0}
          >
            -
          </button>
        </div>
        </div>

        <div className="flex w-full h-full max-w-36 max-h-36 items-center justify-center">
          <img src={image} alt="productImage" className="aspect-square overflow-hidden object-scale-down" />
        </div>
      </div>
    );
  }
}

export default withCart(CartItem);
