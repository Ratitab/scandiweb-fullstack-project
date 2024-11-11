import React, { Component } from "react";
import {  useNavigate } from "react-router-dom";

class ProductCard extends Component {
  handleClickProductCardClick = () => {
    const { navigate, id, category } = this.props;
    if (navigate && id && category) {
      navigate(`/${category}/${id}`);
    }
  };

  render() {
    const { image, name, price, inStock } = this.props;
    return (
      <div className="bg-white rounded-lg p-4 cursor-pointer" onClick={this.handleClickProductCardClick}>
        <div className="relative">
          <img src={image || ""} alt="POTO" className="w-full h-96 object-cover object-top rounded-lg z-0" />
          {!inStock && (
            <div 
            className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-70 flex text-gray-400 items-center justify-center text-lg font-light"
            style={{ zIndex: 10 }}
            >
              OUT OF STOCK
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

export default withNavigate(ProductCard);
