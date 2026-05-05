import { Router } from 'express';
import searchRoutes from './search.js';
import dashboardRoutes from './dashboard.js';
import historyRoutes from './history.js';
import settingsRoutes from './settings.js';
import exportRoutes from './export.js';

const router = Router();

router.use('/search', searchRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/history', historyRoutes);
router.use('/settings', settingsRoutes);
router.use('/export', exportRoutes);

export default router;
