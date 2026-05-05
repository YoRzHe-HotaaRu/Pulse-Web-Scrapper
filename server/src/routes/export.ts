import { Router } from 'express';
import { exportData } from '../controllers/exportController.js';

const router = Router();

router.get('/:format', exportData);

export default router;
