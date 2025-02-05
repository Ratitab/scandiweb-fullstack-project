import { React, Component } from "react";
import CartItem from "./cartItem";
import { withCart } from "../../../context/cartContext";
import PlaceOrderService from "../../../services/PlaceOrderService";

class Modal extends Component {
  handlePlaceOrder = async () => {
    const { cart, clearCart } = this.props;
    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      selectedAttributes: Object.keys(item.selectedAttributes || {}).map((key) => ({
        name: key,
        value: item.selectedAttributes[key].value
      }))
    }));

    const mutationVariables = {
      orderItems,
    };

    try {
      const result = await PlaceOrderService.placeOrder(mutationVariables);
      alert(result.message);
      clearCart();
    } catch (err) {
      console.error("Order placement failed", err);
    }
  };

  calculateTotalPrice() {
    const { cart } = this.props;
    return cart.reduce((accumulator, product) => {
        const priceAmount = product.price?.amount || 0;
        return accumulator + priceAmount * product.quantity;
    }, 0);
}

  render() {
    const { isOpen, cart } = this.props;
    const totalPrice = this.calculateTotalPrice();

    if (!isOpen) return null;

    return (
      <div
        className="absolute top-full right-0 mt-5 z-20 bg-white p-4 md:p-6 w-96 md:w-96 h-[calc(100vh-78px)] md:h-auto overflow-y-auto shadow-lg "
      >
        <div>
          <strong className="font-bold">My Bag</strong>, {cart.length}{" "}
          {cart.length === 1 ? "item" : "items"}
        </div>
        <div className="mt-4 space-y-4">
          {cart.map((product) => (
            <CartItem
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price.amount}
              quantity={product.quantity}
              image={product.image}
              selectedAttributes={product.selectedAttributes}
              attributes={product.attributes ? product.attributes : []}
              cart={cart}
            />
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <div>Total</div>
          <div>${totalPrice.toFixed(2)}</div>
        </div>
        <button
          onClick={this.handlePlaceOrder}
          disabled={cart.length === 0}
          className={`mt-6 font-semibold text-sm w-full py-3 px-4 
            ${cart.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}
        >
          PLACE ORDER
        </button>
      </div>
    );
  }
}

export default withCart(Modal);
