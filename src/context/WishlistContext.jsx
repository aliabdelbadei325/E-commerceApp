import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Fetch wishlist on load or when auth status changes
    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await api.get('/wishlist');
            if (response.data.success) {
                setWishlist(response.data.wishlist);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        if (!isAuthenticated) return false;
        try {
            const response = await api.post(`/wishlist/${productId}`);
            if (response.data.success) {
                setWishlist(response.data.wishlist);
                return true;
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
        return false;
    };

    const removeFromWishlist = async (productId) => {
        if (!isAuthenticated) return false;
        try {
            const response = await api.delete(`/wishlist/${productId}`);
            if (response.data.success) {
                setWishlist(response.data.wishlist);
                return true;
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
        return false;
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => (item.id === productId || item._id === productId));
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            refreshWishlist: fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
