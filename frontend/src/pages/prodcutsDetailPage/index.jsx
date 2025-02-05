import React, { Component } from "react";
import GetPDPService from "../../services/GetPDPService";
import { QueryClient } from "react-query";
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
        GetPDPService.getPDP(productID)
      );
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
    const { addToCart, toggleCart } = this.props;

    const selectedProduct = {
      id: PDPDetails.id,
      name: PDPDetails.name,
      image: PDPDetails.image_gallery[0],
      price: PDPDetails.price,
      attributes: PDPDetails.attributes,
      selectedAttributes,
    };

    addToCart(selectedProduct);
    toggleCart();
  };

  isAddToCartDisabled = () => {
    const { PDPDetails, selectedAttributes } = this.state;

    if (!PDPDetails.in_stock) {
      return true;
    }

    return (
      PDPDetails.attributes &&
      PDPDetails.attributes.some((attr) => !selectedAttributes[attr.name])
    );
  };

  render() {
    const { PDPDetails, selectedAttributes, currentImageIndex } = this.state;

    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8" data-testid="product-details-container">
        {/* Gallery */}
        <div className="lg:w-1/2 flex gap-4" data-testid="product-gallery">
          <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
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

          <div className="relative flex-1 flex justify-center items-center max-h-96">
            <button
              onClick={() =>
                this.setState((prevState) => ({
                  currentImageIndex:
                    (prevState.currentImageIndex - 1 + PDPDetails.image_gallery.length) %
                    PDPDetails.image_gallery.length,
                }))
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
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
              className="w-full h-full object-contain"
            />

            <button
              onClick={() =>
                this.setState((prevState) => ({
                  currentImageIndex:
                    (prevState.currentImageIndex + 1) % PDPDetails.image_gallery.length,
                }))
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
            >
              <img src={vector} alt="Next" className="transform rotate-180" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col lg:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold">{PDPDetails.name}</h1>

          {/* Attribute Containers */}
          {PDPDetails?.attributes &&
            PDPDetails?.attributes?.map((attribute) => (
              <div
                key={attribute.name}
                className="mt-6"
                data-testid={`product-attribute-${attribute.name
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
              >
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
                              border:
                                selectedAttributes[attribute.name]?.value ===
                                item.value ? '2px solid green'
                                :'1px solid gray'
                            }
                          : {}
                      }
                      data-testid={
                        
                           `product-attribute-${attribute.name
                        .replace(/\s+/g, "-")
                        .toLowerCase()}-${item.value}`
                          
                      }
                    >
                      {attribute.name === "Color" ? "" : item.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

          {/* Price */}
          <div className="mt-6">
            <h4 className="font-semibold tracking-wide">PRICE:</h4>
            <p className="font-bold mt-2 text-xl">
              {PDPDetails.price?.currency_symbol}
              {PDPDetails.price?.amount}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            className={`text-sm w-full lg:w-96 py-3 px-4 mt-4 ${
              this.isAddToCartDisabled()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-400 hover:bg-green-500 text-white"
            }`}
            onClick={this.handleAddToCart}
            disabled={this.isAddToCartDisabled()}
            data-testid="add-to-cart"
          >
            Add to Cart
          </button>

          {/* Product Description */}
          <div className="mt-4" data-testid="product-description">
            <p>{PDPDetails.description}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withCart(ProductDetailPage);
