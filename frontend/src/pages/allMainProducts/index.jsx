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

      const filteredProducts = this.props.category
        ? result.productDetails.filter(
            (product) => product.category_name === this.props.category
          )
        : result.productDetails;

      this.setState({ allProducts: filteredProducts });
    } catch (err) {
      console.error("Error fetching products:", err);
      throw err;
    }
  };

  render() {
    const { category } = this.props;
    const { allProducts } = this.state;

    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          {category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : "All Products"}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {allProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              inStock={product.in_stock}
              category={product.category_name}
              image={product.image_gallery[0]}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default AllMainProducts;
