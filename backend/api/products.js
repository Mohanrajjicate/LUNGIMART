import { Router } from 'express';
import { db } from '../data/db.js';

const router = Router();

// GET /api/products
// Returns all products with full category and review data attached
router.get('/', (req, res) => {
    try {
        const products = db.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// GET /api/products/:slug
// Returns a single product by its slug
router.get('/:slug', (req, res) => {
    try {
        const product = db.getAllProducts().find(p => p.slug === req.params.slug);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});

export default router;
