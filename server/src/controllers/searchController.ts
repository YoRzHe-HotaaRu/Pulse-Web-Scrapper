import { Request, Response, NextFunction } from 'express';
import { shopeeService } from '../services/shopeeService.js';
import { exaService } from '../services/exaService.js';
import { openRouterService } from '../services/openRouterService.js';
import { AuthRequest } from '../middleware/auth.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';

export async function searchProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { query, category, minPrice, maxPrice, minRating, sortBy, page, limit } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new ValidationError('Search query is required');
    }

    const authReq = req as AuthRequest;
    if (authReq.apiKeys?.exa) {
      exaService.initialize(authReq.apiKeys.exa);
    }
    if (authReq.apiKeys?.openrouter) {
      openRouterService.initialize(authReq.apiKeys.openrouter);
    }

    if (!authReq.apiKeys?.exa && !authReq.apiKeys?.openrouter) {
      throw new ValidationError(
        'API keys not configured. Please set Exa and OpenRouter API keys in Settings, or configure them in the server .env file.',
      );
    }

    const TIMEOUT_MS = 90000;
    const result = await Promise.race([
      shopeeService.search({
        query: query.trim(),
        category,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        page,
        limit,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Search timed out after 90 seconds. Try a more specific query or fewer results.')), TIMEOUT_MS)
      ),
    ]);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError('Product ID is required');
    }

    const product = shopeeService.getProductById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function analyzeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError('Product ID is required');
    }

    const product = shopeeService.getProductById(id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const authReq = req as AuthRequest;
    if (authReq.apiKeys?.openrouter) {
      openRouterService.initialize(authReq.apiKeys.openrouter);
    }

    if (!authReq.apiKeys?.openrouter) {
      throw new ValidationError(
        'API key not configured. Please set OpenRouter API key in Settings, or configure OPENROUTER_API_KEY in the server .env file.',
      );
    }

    const analysis = await openRouterService.analyzeProduct(product);

    shopeeService.updateProductAnalysis(id, analysis);

    res.json({
      success: true,
      data: { analysis, productId: id },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecentProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const products = shopeeService.getRecentProducts(Math.min(limit, 200));

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}
