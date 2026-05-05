import { Router } from 'express';
import { saveKeys, getKeyStatus, testKeys } from '../controllers/settingsController.js';

const router = Router();

router.get('/keys', getKeyStatus);
router.post('/keys', saveKeys);
router.post('/keys/test', testKeys);

export default router;
