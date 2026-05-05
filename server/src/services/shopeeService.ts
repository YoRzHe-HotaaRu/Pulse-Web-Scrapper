import { v4 as uuidv4 } from 'uuid';
import { exaService } from './exaService.js';
import { openRouterService } from './openRouterService.js';
import { db } from '../db/database.js';

export class ShopeeService {
  async search(params: {
    query: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const startTime = Date.now();
    const limit = params.limit || 20;
    const page = params.page || 1;

    const searchResults = await exaService.searchProducts(params.query, {
      numResults: limit,
      category: params.category,
    });

    console.log(`[Exa] Query "${params.query}" returned ${searchResults.results?.length || 0} results`);
    if (searchResults.results?.length > 0) {
      console.log(`[Exa] First result title: "${searchResults.results[0]?.title?.substring(0, 80)}"`);
    }

    const BATCH_SIZE = 5;
    const results = searchResults.results || [];
    const products = [];

    for (let i = 0; i < results.length && products.length < limit; i += BATCH_SIZE) {
      const batch = results.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (result: { title: string; text: string; url: string }) => {
          try {
            return await openRouterService.structureProductData({
              title: result.title,
              text: result.text,
              url: result.url,
            });
          } catch (err: any) {
            console.warn(`[OpenRouter] Structuring failed for: "${result.title?.substring(0, 60)}" — ${err?.message || err}`);
            return null;
          }
        })
      );

      let batchProductCount = 0;
      for (let j = 0; j < batchResults.length && products.length < limit; j++) {
        const structuredData = batchResults[j];
        if (structuredData) {
          const result = batch[j];
          const product = {
            id: uuidv4(),
            ...structuredData,
            url: result.url,
            imageUrl: result.image || '',
            createdAt: new Date().toISOString(),
          };
          this.saveProduct(product);
          products.push(product);
          batchProductCount++;
        }
      }

      for (let j = 0; j < batchResults.length && products.length < limit; j++) {
        if (!batchResults[j]) {
          const result = batch[j];
          console.warn(`[Shopee] Falling back to raw Exa data for: "${result.title?.substring(0, 60)}"`);
          const product = {
            id: uuidv4(),
            title: result.title || 'Unknown Product',
            price: 0,
            rating: 0,
            soldCount: 0,
            shopName: 'Unknown',
            shopLocation: '',
            category: '',
            description: (result.text || '').substring(0, 500),
            highlights: [],
            url: result.url,
            imageUrl: result.image || '',
            createdAt: new Date().toISOString(),
          };
          this.saveProduct(product);
          products.push(product);
        }
      }
    }

    console.log(`[Shopee] Structured ${products.length}/${results.length} products from Exa results`);

    this.saveSearchHistory(params.query, products.length);

    const searchTime = Date.now() - startTime;

    return {
      products,
      totalCount: products.length,
      page,
      totalPages: Math.ceil(products.length / limit),
      searchTime,
      query: params.query,
    };
  }

  private saveProduct(product: any): void {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO products (id, title, price, original_price, discount, rating, sold_count, image_url, shop_name, shop_location, category, url, description, highlights, ai_analysis, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      product.id,
      product.title || 'Untitled Product',
      product.price ?? 0,
      product.originalPrice || null,
      product.discount || null,
      product.rating || 0,
      product.soldCount || 0,
      product.imageUrl || '',
      product.shopName || '',
      product.shopLocation || '',
      product.category || '',
      product.url || '',
      product.description || null,
      JSON.stringify(product.highlights || []),
      JSON.stringify(product.aiAnalysis || null),
      product.createdAt || new Date().toISOString()
    );
  }

  private saveSearchHistory(query: string, resultCount: number): void {
    const stmt = db.prepare(`
      INSERT INTO search_history (id, query, filters, result_count, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(uuidv4(), query, '{}', resultCount, new Date().toISOString());
  }

  updateProductAnalysis(id: string, analysis: any): void {
    const stmt = db.prepare('UPDATE products SET ai_analysis = ? WHERE id = ?');
    stmt.run(JSON.stringify(analysis), id);
  }

  getProductById(id: string) {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    if (row) {
      return this.mapProduct(row);
    }
    return null;
  }

  getRecentProducts(limit: number = 50) {
    const rows = db.prepare('SELECT * FROM products ORDER BY created_at DESC LIMIT ?').all(limit) as any[];
    return rows.map((row: any) => this.mapProduct(row));
  }

  getSearchHistory(limit: number = 50) {
    const rows = db.prepare('SELECT * FROM search_history ORDER BY timestamp DESC LIMIT ?').all(limit) as any[];
    return rows.map((row: any) => ({
      id: row.id,
      query: row.query,
      filters: JSON.parse(row.filters || '{}'),
      resultCount: row.result_count,
      timestamp: row.timestamp,
    }));
  }

  getDashboardStats() {
    const totalSearches = db.prepare('SELECT COUNT(*) as count FROM search_history').get() as any;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    const avgPrice = db.prepare('SELECT AVG(price) as avg FROM products').get() as any;
    const avgRating = db.prepare('SELECT AVG(rating) as avg FROM products').get() as any;
    const topCategories = db.prepare(
      'SELECT category as name, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC LIMIT 10'
    ).all() as any[];
    const recentSearches = db.prepare(
      'SELECT query, timestamp, result_count as resultCount FROM search_history ORDER BY timestamp DESC LIMIT 10'
    ).all() as any[];

    return {
      totalSearches: totalSearches?.count || 0,
      totalProducts: totalProducts?.count || 0,
      averagePrice: Math.round(avgPrice?.avg || 0),
      averageRating: Math.round((avgRating?.avg || 0) * 10) / 10,
      topCategories: topCategories || [],
      recentSearches: recentSearches || [],
      priceDistribution: [],
    };
  }

  deleteHistory(id: string): void {
    db.prepare('DELETE FROM search_history WHERE id = ?').run(id);
  }

  private mapProduct(row: any) {
    return {
      id: row.id,
      title: row.title,
      price: row.price,
      originalPrice: row.original_price,
      discount: row.discount,
      rating: row.rating,
      soldCount: row.sold_count,
      imageUrl: row.image_url,
      shopName: row.shop_name,
      shopLocation: row.shop_location,
      category: row.category,
      url: row.url,
      description: row.description,
      highlights: JSON.parse(row.highlights || '[]'),
      aiAnalysis: row.ai_analysis ? JSON.parse(row.ai_analysis) : undefined,
      createdAt: row.created_at,
    };
  }
}

export const shopeeService = new ShopeeService();
