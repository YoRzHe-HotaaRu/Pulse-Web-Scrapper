import { Request, Response, NextFunction } from 'express';
import { db } from '../db/database.js';

export interface AuthRequest extends Request {
  apiKeys: {
    exa: string;
    openrouter: string;
  };
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const exaKey = (req.headers['x-exa-api-key'] as string) || '';
  const openrouterKey = (req.headers['x-openrouter-api-key'] as string) || '';

  if (!exaKey || !openrouterKey) {
    const storedExa = db.prepare(
      "SELECT key_value FROM api_keys WHERE service = 'exa'"
    ).get() as { key_value: string } | undefined;

    const storedOpenRouter = db.prepare(
      "SELECT key_value FROM api_keys WHERE service = 'openrouter'"
    ).get() as { key_value: string } | undefined;

    (req as AuthRequest).apiKeys = {
      exa: exaKey || storedExa?.key_value || process.env.EXA_API_KEY || '',
      openrouter: openrouterKey || storedOpenRouter?.key_value || process.env.OPENROUTER_API_KEY || '',
    };
  } else {
    (req as AuthRequest).apiKeys = {
      exa: exaKey,
      openrouter: openrouterKey,
    };
  }

  next();
}
