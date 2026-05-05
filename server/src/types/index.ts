export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  soldCount: number;
  imageUrl: string;
  shopName: string;
  shopLocation: string;
  category: string;
  url: string;
  description?: string;
  highlights?: string[];
  aiAnalysis?: AIAnalysis;
  createdAt: string;
}

export interface AIAnalysis {
  summary: string;
  pros: string[];
  cons: string[];
  competitorComparison: string;
  priceAssessment: string;
  rating: number;
}

export interface SearchParams {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'sales';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
  page: number;
  totalPages: number;
  searchTime: number;
  query: string;
}

export interface DashboardStats {
  totalSearches: number;
  totalProducts: number;
  averagePrice: number;
  averageRating: number;
  topCategories: { name: string; count: number }[];
  recentSearches: { query: string; timestamp: string; resultCount: number }[];
  priceDistribution: { range: string; count: number }[];
}

export interface SearchHistoryEntry {
  id: string;
  query: string;
  filters: SearchParams;
  resultCount: number;
  timestamp: string;
}

export interface ApiKeys {
  exa: string;
  openrouter: string;
}
