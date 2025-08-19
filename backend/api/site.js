import { Router } from 'express';
import { db } from '../data/db.js';

const router = Router();

// A combined endpoint to get all necessary non-product site data
router.get('/data', (req, res) => {
    try {
        const data = {
            categories: db.getAllCategories(),
            banners: db.getAllBanners(),
            coupons: db.getAllCoupons(),
        };
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching site data' });
    }
});

export default router;
