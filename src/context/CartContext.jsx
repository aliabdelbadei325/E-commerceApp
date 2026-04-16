import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

/**
 * Cart Context
 * Manages shopping cart state with localStorage and backend persistence
 */

// Action Types
const CART_ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    LOAD_CART: 'LOAD_CART',
    TOGGLE_CART: 'TOGGLE_CART',
    APPLY_COUPON: 'APPLY_COUPON',
    REMOVE_COUPON: 'REMOVE_COUPON'
};

// Initial State
const initialState = {
    items: [],
    isOpen: false,
    appliedCoupon: null
};

// Reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.ADD_ITEM: {
            const existingItemIndex = state.items.findIndex(
                item => (item.id || item._id) === (action.payload.id || action.payload._id)
            );

            if (existingItemIndex > -1) {
                // Item exists, update quantity
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1
                };
                return { ...state, items: updatedItems };
            }

            // New item
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };
        }

        case CART_ACTIONS.REMOVE_ITEM:
            return {
                ...state,
                items: state.items.filter(item => (item.id || item._id) !== action.payload)
            };

        case CART_ACTIONS.UPDATE_QUANTITY: {
            const { id, quantity } = action.payload;

            if (quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter(item => (item.id || item._id) !== id)
                };
            }

            return {
                ...state,
                items: state.items.map(item =>
                    (item.id || item._id) === id ? { ...item, quantity } : item
                )
            };
        }

        case CART_ACTIONS.CLEAR_CART:
            return { ...state, items: [] };

        case CART_ACTIONS.LOAD_CART:
            return { ...state, items: action.payload };

        case CART_ACTIONS.TOGGLE_CART:
            return { ...state, isOpen: action.payload !== undefined ? action.payload : !state.isOpen };

        case CART_ACTIONS.APPLY_COUPON:
            return { ...state, appliedCoupon: action.payload };

        case CART_ACTIONS.REMOVE_COUPON:
            return { ...state, appliedCoupon: null };

        default:
            return state;
    }
};

// Create Context
const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { isAuthenticated } = useAuth();

    // 1. Load cart from localStorage on mount (Initial Load)
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('ecommerce_cart');
            if (savedCart) {
                dispatch({ type: CART_ACTIONS.LOAD_CART, payload: JSON.parse(savedCart) });
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        }
    }, []);

    // 2. Sync with backend when authenticated
    useEffect(() => {
        const syncCart = async () => {
            if (isAuthenticated) {
                try {
                    const response = await api.get('/cart');
                    if (response.data.success) {
                        const serverItems = response.data.items.map(item => ({
                            ...item,
                            id: item.product // Ensure frontend uses 'id'
                        }));

                        // If local cart has items and server is empty, push local to server
                        const localCart = state.items;
                        if (localCart.length > 0 && serverItems.length === 0) {
                            await api.post('/cart/sync', {
                                items: localCart.map(item => ({
                                    product: item.id || item._id,
                                    quantity: item.quantity,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image
                                }))
                            });
                        } else {
                            // Otherwise, server takes precedence (or we could merge)
                            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: serverItems });
                        }
                    }
                } catch (error) {
                    console.error('Failed to sync cart with server:', error);
                }
            }
        };

        syncCart();
    }, [isAuthenticated]);

    // 3. Persist to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem('ecommerce_cart', JSON.stringify(state.items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [state.items]);

    // Actions
    const addToCart = async (product) => {
        dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
        dispatch({ type: CART_ACTIONS.TOGGLE_CART, payload: true }); // Open drawer on add

        if (isAuthenticated) {
            try {
                await api.post('/cart', {
                    productId: product.id || product._id,
                    quantity: 1
                });
            } catch (error) {
                console.error('API Error: Add to cart failed', error);
            }
        }
    };

    const removeFromCart = async (productId) => {
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });

        if (isAuthenticated) {
            try {
                await api.delete(`/cart/${productId}`);
            } catch (error) {
                console.error('API Error: Remove from cart failed', error);
            }
        }
    };

    const updateQuantity = async (productId, quantity) => {
        dispatch({
            type: CART_ACTIONS.UPDATE_QUANTITY,
            payload: { id: productId, quantity }
        });

        if (isAuthenticated) {
            try {
                await api.put(`/cart/${productId}`, { quantity });
            } catch (error) {
                console.error('API Error: Update quantity failed', error);
            }
        }
    };

    const clearCart = async () => {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });

        if (isAuthenticated) {
            try {
                await api.delete('/cart');
            } catch (error) {
                console.error('API Error: Clear cart failed', error);
            }
        }
    };

    const toggleCart = (isOpen) => {
        dispatch({ type: CART_ACTIONS.TOGGLE_CART, payload: isOpen });
    };

    const applyCoupon = async (code) => {
        try {
            const response = await api.post('/coupons/validate', {
                code,
                amount: cartSubtotal
            });

            if (response.data.success) {
                dispatch({ type: CART_ACTIONS.APPLY_COUPON, payload: response.data.coupon });
                return { success: true, message: 'Coupon applied successfully!' };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Invalid coupon code';
            return { success: false, message };
        }
    };

    const removeCoupon = () => {
        dispatch({ type: CART_ACTIONS.REMOVE_COUPON });
    };

    // Computed values
    const cartItemsCount = state.items.reduce(
        (total, item) => total + (item.quantity || 0),
        0
    );

    const cartSubtotal = state.items.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 0),
        0
    );

    const cartTax = cartSubtotal * 0.1; // 10% tax
    const cartDiscount = state.appliedCoupon ? state.appliedCoupon.discountAmount : 0;
    const cartTotal = Math.max(0, cartSubtotal + cartTax - cartDiscount);

    const value = {
        items: state.items,
        isCartOpen: state.isOpen,
        appliedCoupon: state.appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        applyCoupon,
        removeCoupon,
        cartItemsCount,
        cartSubtotal,
        cartTax,
        cartDiscount,
        cartTotal
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom Hook
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export { CartContext };
