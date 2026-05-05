import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';
import { exaService } from '../services/exaService.js';
import { openRouterService } from '../services/openRouterService.js';
import { ValidationError } from '../middleware/errorHandler.js';

export async function saveKeys(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { exa, openrouter } = req.body;

    if (!exa || !openrouter) {
      throw new ValidationError('Both exa and openrouter API keys are required');
    }

    const upsertKey = db.prepare(`
      INSERT INTO api_keys (id, service, key_value, created_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(service) DO UPDATE SET key_value = excluded.key_value
    `);

    const now = new Date().toISOString();
    upsertKey.run(uuidv4(), 'exa', exa, now);
    upsertKey.run(uuidv4(), 'openrouter', openrouter, now);

    res.json({
      success: true,
      data: { message: 'API keys saved successfully' },
    });
  } catch (error) {
    next(error);
  }
}

export async function getKeyStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const exaRow = db.prepare("SELECT service, created_at FROM api_keys WHERE service = 'exa'").get() as any;
    const openRouterRow = db.prepare("SELECT service, created_at FROM api_keys WHERE service = 'openrouter'").get() as any;

    res.json({
      success: true,
      data: {
        exa: exaRow ? { configured: true, savedAt: exaRow.created_at } : { configured: false },
        openrouter: openRouterRow ? { configured: true, savedAt: openRouterRow.created_at } : { configured: false },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function testKeys(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { exa, openrouter } = req.body;

    const results: { exa: { valid: boolean; error?: string }; openrouter: { valid: boolean; error?: string } } = {
      exa: { valid: false },
      openrouter: { valid: false },
    };

    if (exa) {
      try {
        exaService.initialize(exa);
        await exaService.searchProducts('test product', { numResults: 1 });
        results.exa.valid = true;
      } catch (err: any) {
        results.exa.error = err.message || 'EXA_API_KEY validation failed';
      }
    }

    if (openrouter) {
      try {
        openRouterService.initialize(openrouter);
        const response = await openRouterService.analyzeProduct({ title: 'Test Product' });
        results.openrouter.valid = !!response;
      } catch (err: any) {
        results.openrouter.error = err.message || 'OpenRouter key validation failed';
      }
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}
