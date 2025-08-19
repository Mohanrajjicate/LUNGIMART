import { Router } from 'express';
import { db } from '../data/db.js';

const router = Router();

// This is a mock authentication middleware.
const authenticate = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ message: 'User ID not provided' });
    }
    req.userId = parseInt(userId, 10);
    next();
};

// GET /api/orders
// Get orders for the authenticated user
router.get('/', authenticate, (req, res) => {
    try {
        const orders = db.getOrdersByUserId(req.userId);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// POST /api/orders
// Create a new order
router.post('/', authenticate, (req, res) => {
    const { items, total, customerName, paymentMethod } = req.body;
    
    if (!items || !total || !customerName) {
        return res.status(400).json({ message: 'Missing required order data.' });
    }

    try {
        const orderData = {
            userId: req.userId,
            items: items.map(item => ({...db.getProductById(item.id), quantity: item.quantity})), // get full item details
            total,
            status: 'Processing',
            reviewedProducts: {},
            customerName,
            paymentMethod: paymentMethod || 'Prepaid',
        };
        const newOrder = db.addOrder(orderData);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// PATCH /api/orders/:orderId/status (for admin)
router.patch('/:orderId/status', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    try {
        const updatedOrder = db.updateOrderStatus(orderId, status);
        if (updatedOrder) {
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

export default router;
