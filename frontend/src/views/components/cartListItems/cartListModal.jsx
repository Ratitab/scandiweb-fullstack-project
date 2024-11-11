import {React, Component} from "react";
import CartItem from "./cartItem";
import { withCart } from "../../../context/cartContext";
import PlaceOrder from "../../../hooks/placeOrderMutation";

const products = [
  {
    name: "Running Shorts",
    price: 25.5,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#15A4C3", "#1D1F22", "#0F6450"],
    image: "path/to/running-shorts.jpg", 
    amount: 1,
  },
  {
    name: "Yoga Pants",
    price: 40.0,
    sizes: ["S", "M", "L"],
    colors: ["#FFC107", "#FF5722", "#673AB7"],
    image: "path/to/yoga-pants.jpg",
    amount: 1,
  },
  {
    name: "Basketball Jersey",
    price: 30.75,
    sizes: ["M", "L", "XL"],
    colors: ["#E91E63", "#2196F3", "#4CAF50"],
    image: "path/to/basketball-jersey.jpg",
    amount: 1,
  },
  {
    name: "Tennis Skirt",
    price: 35.0,
    sizes: ["XS", "S", "M"],
    colors: ["#9C27B0", "#FF9800", "#3F51B5"],
    image: "path/to/tennis-skirt.jpg",
    amount: 1,
  },
  {
    name: "Cycling Shorts",
    price: 28.25,
    sizes: ["M", "L", "XL"],
    colors: ["#607D8B", "#FFEB3B", "#8BC34A"],
    image: "path/to/cycling-shorts.jpg",
    amount: 1,
  },
  {
    name: "Athletic T-Shirt",
    price: 20.0,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#FF5722", "#009688", "#795548"],
    image: "path/to/athletic-tshirt.jpg",
    amount: 1,
  },
  {
    name: "Compression Socks",
    price: 15.99,
    sizes: ["M", "L"],
    colors: ["#FF9800", "#2196F3"],
    image: "path/to/compression-socks.jpg",
    amount: 1,
  },
  {
    name: "Hoodie",
    price: 50.0,
    sizes: ["S", "M", "L", "XL"],
    colors: ["#9C27B0", "#F44336", "#3F51B5"],
    image: "path/to/hoodie.jpg",
    amount: 1,
  },
  {
    name: "Windbreaker Jacket",
    price: 60.0,
    sizes: ["S", "M", "L"],
    colors: ["#607D8B", "#FFC107", "#8BC34A"],
    image: "path/to/windbreaker-jacket.jpg",
    amount: 1,
  },
  {
    name: "Training Shoes",
    price: 75.5,
    sizes: ["8", "9", "10", "11"],
    colors: ["#E91E63", "#F44336", "#009688"],
    image: "path/to/training-shoes.jpg",
    amount: 1,
  },
];



class Modal extends Component {
  handlePlaceOrder =  async () => {
    const {cart, clearCart } = this.props
    console.log(cart)
    const orderItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      selectedAttributes: Object.keys(item.selectedAttributes || {}).map((key) => ({
        name: key,
        value: item.selectedAttributes[key].value
      }))
    }))

    const mutationVariables  = {
      orderItems,
    }

    try {
      console.log("FAILED")
      const result = await PlaceOrder.placeOrder(mutationVariables)
      alert(result.message)
      console.log("EGAA ARIKA", result)

      clearCart()
    } catch (err) {

      throw new Error("FAAILEDDDD",err)
    }
  }

  calculateTotalPrice ()  {
    const {cart } = this.props
    return cart.reduce((accumulator, product) => {
      return accumulator + product.price.amount * product.quantity;
    }, 0);
  };

  render() {
    const { isOpen, cart } = this.props;

    console.log("KARTT",cart)

    const totalPrice = this.calculateTotalPrice();
    if (!isOpen) return null;

    return (
      <div className="absolute top-full mt-5 right-0 z-20 bg-white p-6 w-96 max-h-[540px] overflow-y-scroll" >
        <div>
          <strong className="font-bold">My Bag</strong>, {cart.length}{" "}
          {cart.length === 1 || cart.length === 0 ? "item" : "items"}
        </div>
        <div className="">
          {cart.map((product) => (
            <CartItem
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price.amount}
              // sizes={product.sizes}
              // colors={product.colors}
              quantity={product.quantity}
              image={product.image}
              selectedAttributes={product.selectedAttributes}
              attributes={product.attributes ? product.attributes : []}
              cart={cart}
            />
          ))}
        </div>
        <div className="flex mb-14 justify-between">
          <div>Total</div>
          <div>${totalPrice.toFixed(2)}</div>
        </div>
        <div>
          {}
          <button 
          onClick={this.handlePlaceOrder}
          disabled={cart.length === 0}
          className={`font-semibold text-sm w-full py-3 px-4 
            ${cart.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}>
            PLACE ORDER
          </button>
        </div>
      </div>
    );
  }
}

export default withCart( Modal);

