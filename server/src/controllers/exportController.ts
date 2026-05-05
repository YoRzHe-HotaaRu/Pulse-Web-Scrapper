import { Request, Response, NextFunction } from 'express';
import { shopeeService } from '../services/shopeeService.js';
import { ValidationError } from '../middleware/errorHandler.js';

export async function exportData(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const format = (req.params.format || 'json').toLowerCase();

    if (!['json', 'csv'].includes(format)) {
      throw new ValidationError('Export format must be either "json" or "csv"');
    }

    const products = shopeeService.getRecentProducts(10000);

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="products.json"');
      res.json({
        success: true,
        data: products,
        exportedAt: new Date().toISOString(),
      });
      return;
    }

    if (format === 'csv') {
      const csvHeaders = [
        'id', 'title', 'price', 'originalPrice', 'discount', 'rating',
        'soldCount', 'imageUrl', 'shopName', 'shopLocation', 'category',
        'url', 'description', 'createdAt',
      ];

      const escapeCsv = (val: any): string => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const csvRows = [csvHeaders.join(',')];
      for (const p of products) {
        const row = csvHeaders.map((h) => {
          const key = h as keyof typeof p;
          return escapeCsv(p[key]);
        });
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
      res.send(csvContent);
    }
  } catch (error) {
    next(error);
  }
}
