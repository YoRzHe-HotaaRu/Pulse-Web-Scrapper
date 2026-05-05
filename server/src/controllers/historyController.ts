import { Request, Response, NextFunction } from 'express';
import { shopeeService } from '../services/shopeeService.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';

export async function getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const history = shopeeService.getSearchHistory(Math.min(limit, 200));

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError('History entry ID is required');
    }

    shopeeService.deleteHistory(id);

    res.json({
      success: true,
      data: { message: 'History entry deleted' },
    });
  } catch (error) {
    next(error);
  }
}
