import { Children, Component, createContext, useContext, useEffect, useState } from "react"
import { isError } from "react-query"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export class CartProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cart: JSON.parse(sessionStorage.getItem("cart")) || [],
            isCartOpen: false
        }
    }


    componentDidUpdate(_, prevState) {
        if(prevState.cart !== this.state.cart) {
            sessionStorage.setItem('cart', JSON.stringify(this.state.cart))
        }
    }

    addToCart = (product) => {
        this.setState((prevState) => {
            const existingItemIndex = prevState.cart.findIndex(
                (item) =>
                    item.id === product.id &&
                    JSON.stringify(item.selectedAttributes) === JSON.stringify(product.selectedAttributes)
            )
            // console.log("[ITEM INDEX]", existingItemIndex)

            if (existingItemIndex > -1) {
                const updatedCart = [...prevState.cart]
                updatedCart[existingItemIndex].quantity += 1
                // console.log("adding to qquantity", updatedCart)
                return {cart: updatedCart}
            } else {
                return {cart: [...prevState.cart, {...product, quantity: 1}]}
            }
        })
    }

    toggleCart = () => {
        this.setState((prevState) => ({isCartOpen: !prevState.isCartOpen}))
    }

    areAttributesEqual = (attributes1, attributes2) => {
        if (Object.keys(attributes1).length !== Object.keys(attributes2).length) return false;
    
        for (let key in attributes1) {
            if (attributes1[key] !== attributes2[key]) {
                return false;
            }
        }
        return true;
    }

    incrementQuantity = (productId, selectedAttributes) => {

        this.setState((prevState) => {
            const cart = prevState.cart.map((item) => {

                if (item.id === productId && this.areAttributesEqual(item.selectedAttributes, selectedAttributes)) {
                    
                    return {...item, quantity: item.quantity + 1}
                } 
                return item
            })
            return {cart}
        })
    }

    decrementQuantity = (productId, selectedAttributes) => {
        this.setState((prevState) => {
            const cart = prevState.cart.map((item) => {
                if (item.id === productId && JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)) {
                    return {...item, quantity: item.quantity - 1}
                } 
                return item
            })
            return {cart}
        })
    }

    removeFromCart = (productId, selectedAttributes) => {
        this.setState((prevState) => {
            const cart = prevState.cart.filter(
                (item) => !(item.id === productId && this.areAttributesEqual(item.selectedAttributes, selectedAttributes))
            )

            return {cart}
        })
    } 


    clearCart = () => {
        this.setState({ cart: []})
    }
 

    render() {
        return (
            <CartContext.Provider
            value={{
                cart: this.state.cart,
                addToCart: this.addToCart,
                toggleCart: this.toggleCart,
                isCartOpen: this.state.isCartOpen,
                incrementQuantity: this.incrementQuantity,
                decrementQuantity: this.decrementQuantity,
                removeFromCart:this.removeFromCart,
                clearCart: this.clearCart,
            }}>
                {this.props.children}
            </CartContext.Provider>
        )
    }
}

export const withCart = (Component) => (props) =>
(
    <CartContext.Consumer>
        {(CartContext) => <Component {...props} {...CartContext} />}
    </CartContext.Consumer>
)
