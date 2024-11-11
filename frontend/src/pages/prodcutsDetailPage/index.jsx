import React, { Component } from "react";
import GetPDP from "../../hooks/getPDP";
import { QueryClient } from "react-query";
// import Modal from "../../views/components/cartListItems/cartListModal";
import vector from "../../assets/png/Vector.png";
import { withCart } from "../../context/cartContext";

const queryClient = new QueryClient();

class ProductDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PDPDetails: {},
      selectedAttributes: {},
      currentImageIndex: 0,
      cart: [],
      isCartOpen: false,
    };
  }

  componentDidMount() {
    this.fetchPDP();
    this.loadCartFromSession();
  }

  fetchPDP = async () => {
    const urlParts = window.location.pathname.split("/");
    const productID = urlParts[urlParts.length - 1];
    try {
      const result = await queryClient.fetchQuery("PDP", () =>
        GetPDP.getPDP(productID)
      );
      console.log("ESAA EGGG", result.PDP);
      const PDPResult = result.PDP;
      this.setState({ PDPDetails: PDPResult });
    } catch (err) {
      console.error(err);
    }
  };

  loadCartFromSession = () => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    this.setState({ cart });
  };

  saveCartToSession = () => {
    sessionStorage.setItem("cart", JSON.stringify(this.state.cart));
  };

  handleAttributeClick = (attributeName, item) => {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeName]: item,
      },
    }));
  };

  handleAddToCart = () => {
    const { PDPDetails, selectedAttributes } = this.state;
    const { addToCart, toggleCart, cart } = this.props;

    const selectedProduct = {
      id: PDPDetails.id,
      name: PDPDetails.name,
      image: PDPDetails.image_gallery[0],
      price: PDPDetails.price,
      attributes: PDPDetails.attributes,
      selectedAttributes,
    };

    addToCart(selectedProduct);
    // console.log("KARTT",cart)
    toggleCart();
  };

  isAddToCartDisabled = () => {
    const { PDPDetails, selectedAttributes } = this.state;

    if(!PDPDetails.in_stock) {
      return true
    }

    return (
      PDPDetails.attributes &&
      PDPDetails.attributes.some((attr) => !selectedAttributes[attr.name])
    );
  };

  render() {
    const {
      PDPDetails,
      selectedAttributes,
      currentImageIndex,
      cart,
      isCartOpen,
    } = this.state;
    console.log("INSTOCKK", PDPDetails.in_stock);
    return (
      <div className="container mx-auto py-20 flex">
        <div className="flex gap-4 w-1/2">
          <div className="flex flex-col space-y-2 overflow-y-auto max-h-96">
            {PDPDetails.image_gallery &&
              PDPDetails.image_gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-24 h-24 object-contain cursor-pointer border ${
                    index === currentImageIndex
                      ? "border-2 border-blue-500"
                      : "border border-gray-200"
                  }`}
                  onClick={() => this.setState({ currentImageIndex: index })}
                />
              ))}
          </div>

          <div className="relative flex-1 flex justify-center items-center">
            <button
              onClick={() =>
                this.setState((prevState) => ({
                  currentImageIndex:
                    (prevState.currentImageIndex -
                      1 +
                      PDPDetails.image_gallery.length) %
                    PDPDetails.image_gallery.length,
                }))
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
            >
              <img src={vector} alt="Previous" />
            </button>

            <img
              src={
                PDPDetails.image_gallery
                  ? PDPDetails.image_gallery[currentImageIndex]
                  : ""
              }
              alt={PDPDetails.name}
              className="w-full h-full object-contain max-h-96"
            />

            <button
              onClick={() =>
                this.setState((prevState) => ({
                  currentImageIndex:
                    (prevState.currentImageIndex + 1) %
                    PDPDetails.image_gallery.length,
                }))
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
            >
              <img src={vector} alt="Next" className="transform rotate-180" />
            </button>
          </div>
        </div>

        <div className="flex flex-col px-12 w-1/2">
          <h1 className="text-3xl font-bold">{PDPDetails.name}</h1>

          {PDPDetails.attributes &&
            PDPDetails.attributes.map((attribute) => (
              <div key={attribute.name} className="mt-6">
                <h4 className="font-semibold tracking-wide">
                  {attribute.name.toUpperCase()}:
                </h4>
                <div className="flex gap-2 mt-2">
                  {attribute.items.map((item) => (
                    <button
                      key={item.value}
                      onClick={() =>
                        this.handleAttributeClick(attribute.name, item)
                      }
                      className={`px-4 py-2 inline-flex items-center justify-center text-sm ${
                        selectedAttributes[attribute.name]?.value === item.value
                          ? "bg-black text-white"
                          : "bg-white text-black border border-gray-600 hover:bg-gray-100"
                      }`}
                      style={
                        attribute.name === "Color"
                          ? {
                              backgroundColor: item.value,
                              width: "24px",
                              height: "24px",
                            }
                          : {}
                      }
                    >
                      {attribute.name === "Color" ? "" : item.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          <div className="mt-8">
            <h4 className="font-semibold tracking-wide">PRICE:</h4>
            <p className="font-bold mt-4 text-xl">
              {PDPDetails.price?.currency_symbol}
              {PDPDetails.price?.amount}
            </p>
          </div>

          <button
            className={`text-sm w-96 py-3 px-4 mt-4 ${
              this.isAddToCartDisabled()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-400 hover:bg-green-500 text-white"
            }`}
            onClick={this.handleAddToCart}
            disabled={this.isAddToCartDisabled()}
          >
            Add to Cart
          </button>

          <div className="mt-4">
            <p>{PDPDetails.description}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withCart(ProductDetailPage);
