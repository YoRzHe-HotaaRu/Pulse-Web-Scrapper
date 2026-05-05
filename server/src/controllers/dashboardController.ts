import { Request, Response, NextFunction } from 'express';
import { shopeeService } from '../services/shopeeService.js';

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = shopeeService.getDashboardStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}
