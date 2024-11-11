import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import quickShopIcon from "../../../assets/png/quickShop.png";
import { withCart } from "../../../context/cartContext";
import GetQuickShop from "../../../hooks/getQuickShop";
import { QueryClient } from "react-query";

const queryClient = new QueryClient()

class ProductCard extends Component {
  handleClickProductCardClick = () => {
    const { navigate, id, category } = this.props;
    if (navigate && id && category) {
      navigate(`/${category}/${id}`);
    }
  };

  fetchAttributesQuickShop = async (productId) => {
    try {
        const result = await queryClient.fetchQuery(['PDP', productId], () => 
            GetQuickShop.getQuickShop(productId)
        );
        console.log("AGIAA ATRIBUTEBI SHEIRGREEEE", result.PDP);
        return result.PDP;
    } catch (err) {
        console.log("ERORIA");
        throw new Error("ERORIA AKANE", err);
    }
}


  handleQuickShop = async (event) => {
    event.stopPropagation();
    const { id, addToCart, name, image, quantity} = this.props;

    const data = await this.fetchAttributesQuickShop(id);
    const defaultAttributes = {};
    const attributes = data.attributes
    const price = data.price

    console.log("PRODUCT ATTRIBUTES", attributes);

    // Populate defaultAttributes with full object structure for each attribute item
    attributes.forEach((attribute) => {
      if (attribute.items && attribute.items.length > 0) {
          defaultAttributes[attribute.name] = {
              display_value: attribute.items[0].display_value,
              value: attribute.items[0].value,
          };
      }
  });

    // Add the product to the cart with default attributes
    addToCart({
        attributes: attributes,
        id:  id ,  // Assuming `id` represents your product here
        selectedAttributes: defaultAttributes,
        name: name,
        image: image,
        quantity: quantity,
        price: price,
    });

    console.log("Added product with default attributes to cart");
};

  render() {
    const { image, name, price, inStock } = this.props;
    return (
      <div
        className="bg-white rounded-lg p-4 cursor-pointer group hover:shadow-lg transition-shadow duration-300"
        onClick={this.handleClickProductCardClick}
      >
        <div className="relative">
          <img
            src={image || ""}
            alt="POTO"
            className="w-full h-96 object-cover object-top rounded-lg z-0"
          />
          {!inStock && (
            <div
              className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-70 flex text-gray-400 items-center justify-center text-lg font-light"
              style={{ zIndex: 10 }}
            >
              OUT OF STOCK
            </div>
          )}

          {inStock && (
            <div
              className="absolute bottom-0 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ zIndex: 2 }}
            >
              <img
                src={quickShopIcon}
                alt="quick shop"
                onClick={this.handleQuickShop}
                className="w-14 h-14 bg-green-500 p-4 rounded-full shadow-lg cursor-pointer"
              />
            </div>
          )}
        </div>
        <h3 className="text-lg font-medium mt-4">{name}</h3>
        <p className="text-gray-500">${price}</p>
      </div>
    );
  }
}

// Custom HOC to use `useNavigate` with class component
function withNavigate(Component) {
  return function WrapperComponent(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

export default withCart(withNavigate(ProductCard));
