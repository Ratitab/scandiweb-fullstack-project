import React, { Component } from "react";
import ProductCard from "../../views/components/productCard";
import { QueryClient } from "react-query";
import GetMainProductsService from "../../hooks/getMainProducts";

const queryClient = new QueryClient();

class AllMainProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
    };
  }

  componentDidMount() {
    this.fetchAllProducts();
  }

  fetchAllProducts = async () => {
    try {
      const result = await queryClient.fetchQuery("productDetails", () =>
        GetMainProductsService.getMainProducts()
      );
      // console.log("[ALLPRODUCTS IN INDEX.JS]", result.productDetails);
      const filteredProducts = this.props.category
      ? result.productDetails.filter(
        (product) => product.category_name === this.props.category
      )
      : result.productDetails
      // const allProducts = result.productDetails;
      this.setState({ allProducts: filteredProducts });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  render() {
    const { category } = this.props
    console.log("allproduct", this.state.allProducts);
    return (
      <div className="container mx-auto py-20 items-center">
        <h1 className="text-3xl">
          <strong>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
          </strong>
        </h1>
        <div className="grid py-16 grid-cols-3 gap-10">
          {this.state.allProducts.map((product) => {
            return (
              <ProductCard
                key = {product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                inStock={product.in_stock}
                category={product.category_name}
                image={product.image_gallery[0]}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default AllMainProducts;
