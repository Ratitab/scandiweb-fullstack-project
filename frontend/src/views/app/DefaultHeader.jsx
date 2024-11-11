import React, { Component } from "react";
import { NavLink, useLocation } from "react-router-dom";
import CompanyLogo from "../../assets/svg/companyLogo";
import CartIcon from "../../assets/svg/cartIcon";
import Modal from "../components/cartListItems/cartListModal";
import { QueryClient } from "react-query";
import CategoryService from "../../hooks/getCategories";
import { withCart } from "../../context/cartContext";

const queryClient = new QueryClient();

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCartModalOpen: false,
      activeUnderlinePosition: 0,
      underlineWidth: 0,
      categories: []
    };
    this.navRef = React.createRef();
  }

  componentDidMount() {
    this.updateUnderline();
    window.addEventListener("resize", this.updateUnderline);
    this.fetchCategories();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.updateUnderline();
    }

    if (this.props.isCartOpen !== prevProps.isCartOpen) {
      document.body.style.overflow = this.props.isCartOpen ? 'hidden' : 'auto';
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateUnderline);
    document.body.style.overflow = 'auto';
  }

  fetchCategories = async () => {
    try {
      const categories = await queryClient.fetchQuery("categories", () => CategoryService.getCategories());
      this.setState({ categories }, this.updateUnderline);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  getMainPath = (pathname) => {
    if (pathname.startsWith("/all")) return "/all";
    if (pathname.startsWith("/clothes")) return "/clothes";
    if (pathname.startsWith("/tech")) return "/tech";
    return pathname;
  };

  updateUnderline = () => {
    const mainPath = this.getMainPath(this.props.location.pathname);
    const activeLink = this.navRef.current.querySelector(`a[href="${mainPath}"]`);
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      this.setState({
        activeUnderlinePosition: rect.left - 15, 
        underlineWidth: rect.width + 30, 
      });
    }
  };

  handleCartClick = () => {
    this.props.toggleCart(); 
  };

  handleOverlayClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      this.props.toggleCart();
    }
  };

  render() {
    const { activeUnderlinePosition, underlineWidth, categories } = this.state;
    const { cart, isCartOpen, } = this.props; 

    return (
      <div className="md:py-0 min-h-[78px] md:h-20 w-full m-auto relative">
        <header className="bg-white relative z-30 min-h-[62px]">
          <nav ref={this.navRef} className="container mx-auto h-[78px] flex justify-between items-center">
            <ul className="flex space-x-12">
              {categories.map((category) => (
                <li key={category.name}>
                  <NavLink
                    to={`${category.name.toLowerCase()}`}
                    className={({ isActive }) =>
                      `relative pb-1 ${isActive ? "text-green-500" : "text-gray-800"} hover:text-green-600`
                    }
                  >
                    {category.name.toUpperCase()}
                  </NavLink>
                </li>
              ))}
            </ul>
            <NavLink to="/all" className="cursor-pointer">
              <CompanyLogo />
            </NavLink>
            <div className="relative items-center">
              <div onClick={this.handleCartClick} className="cursor-pointer size-8">
                <CartIcon />
                {cart.length > 0 && (
                  <div className="absolute bottom-5 right-0 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}  
                  </div>
                )}
              </div>
              {isCartOpen && (
                <>
                  <div
                    className="modal-overlay fixed left-0 right-0 bg-black opacity-50 z-1"
                    style={{
                      top: "78px", 
                      height: `calc(100vh - 78px)`, 
                    }}
                    data-testid='cart-btn'
                    onClick={this.handleOverlayClick} 
                  ></div>
                  <Modal isOpen={isCartOpen} cart={cart} /> 
                </>
              )}
            </div>
          </nav>
          <div
            className="absolute bottom-0 h-0.5 bg-green-400 transition-all duration-300"
            style={{
              left: `${activeUnderlinePosition}px`,
              width: `${underlineWidth}px`,
            }}
          />
        </header>
      </div>
    );
  }
}


function withLocation(Component) {
  return function WrapperComponent(props) {
    const location = useLocation();
    return <Component {...props} location={location} />;
  };
}

export default withLocation(withCart(DefaultHeader));
