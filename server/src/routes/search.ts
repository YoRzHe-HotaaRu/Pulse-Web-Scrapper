import { Router } from 'express';
import { searchProducts, getProduct, getRecentProducts, analyzeProduct } from '../controllers/searchController.js';

const router = Router();

router.post('/', searchProducts);
router.get('/products', getRecentProducts);
router.get('/products/:id', getProduct);
router.post('/products/:id/analyze', analyzeProduct);

export default router;
