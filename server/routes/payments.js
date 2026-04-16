/**
 * Payment Routes
 */

const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
