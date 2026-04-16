const express = require('express');
const router = express.Router();
const {
    getCart,
    syncCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// All cart routes are protected
router.use(protect);

router.route('/')
    .get(getCart)
    .post(addToCart)
    .delete(clearCart);

router.post('/sync', syncCart);

router.route('/:productId')
    .put(updateQuantity)
    .delete(removeFromCart);

module.exports = router;
