import { Router } from 'express';
import { db } from '../data/db.js';

const router = Router();

// This is a mock authentication middleware.
// In a real app, you would verify a JWT.
const authenticate = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ message: 'User ID not provided' });
    }
    req.userId = parseInt(userId, 10);
    next();
};

// POST /api/users/google-login
router.post('/google-login', (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(400).json({ message: 'Email and name are required.' });
    }

    try {
        let user = db.findUserByEmail(email);
        if (!user) {
            user = db.addUser({ name, email, phone: '', password: 'N/A' });
        }
        // In a real app, you would return a JWT here.
        // For this mock, we just return the user object.
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during login' });
    }
});


// GET /api/users/wishlist
router.get('/wishlist', authenticate, (req, res) => {
    try {
        const wishlist = db.getWishlistByUserId(req.userId);
        res.json(wishlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching wishlist' });
    }
});


export default router;
