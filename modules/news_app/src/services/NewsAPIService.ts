import { HTTPClient } from 'valdi_http/src/HTTPClient';
import { HTTPResponse } from 'valdi_http/src/HTTPTypes';

// Dev Digest API Types
export interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  sourceType: 'rss' | 'reddit' | 'hacker_news';
  publishedAt: string;
  author?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  fetchedAt: string;
}

export interface Source {
  id: string;
  name: string;
  type: 'rss' | 'reddit' | 'hacker_news';
  url: string;
  enabled: boolean;
  category: string;
  metadata?: Record<string, any>;
}

export interface ArticlesResponse {
  success: boolean;
  count: number;
  articles: Article[];
  stats?: {
    bySource: Record<string, number>;
    byType: Record<string, number>;
    dateRange: {
      earliest: string;
      latest: string;
    };
  };
}

export interface SourcesResponse {
  success: boolean;
  count: number;
  sources: Source[];
  stats?: {
    total: number;
    enabled: number;
    disabled: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    categories: string[];
  };
}

// Legacy interface for backward compatibility
export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export class NewsAPIService {
  private baseURL = 'https://dev-digest-two.vercel.app';
  private httpClient: HTTPClient;

  constructor() {
    this.httpClient = new HTTPClient(this.baseURL);
  }

  async getSources(enabled?: boolean, category?: string, type?: string): Promise<Source[]> {
    try {
      let path = '/api/sources';
      const params: string[] = [];
      
      if (enabled !== undefined) {
        params.push(`enabled=${enabled}`);
      }
      if (category) {
        params.push(`category=${encodeURIComponent(category)}`);
      }
      if (type) {
        params.push(`type=${type}`);
      }
      
      if (params.length > 0) {
        path += '?' + params.join('&');
      }

      const headers = {
        'User-Agent': 'NewsApp/1.0'
      };

      const response: HTTPResponse = await this.httpClient.get(path, headers);

      if (response.statusCode !== 200) {
        throw new Error(`HTTP ${response.statusCode}: Failed to fetch sources`);
      }

      const text = new TextDecoder().decode(response.body);
      const data: SourcesResponse = JSON.parse(text);

      if (!data.success) {
        throw new Error('API returned error status');
      }

      return data.sources;
    } catch (error) {
      console.error('Failed to fetch sources:', error);
      throw error;
    }
  }

  async getArticles(limit: number = 50, source?: string, type?: string, startDate?: string, endDate?: string): Promise<Article[]> {
    try {
      let path = `/api/articles?limit=${limit}`;
      
      if (source) {
        path += `&source=${source}`;
      }
      if (type) {
        path += `&type=${type}`;
      }
      if (startDate) {
        path += `&startDate=${startDate}`;
      }
      if (endDate) {
        path += `&endDate=${endDate}`;
      }

      const headers = {
        'User-Agent': 'NewsApp/1.0'
      };

      const response: HTTPResponse = await this.httpClient.get(path, headers);

      if (response.statusCode !== 200) {
        throw new Error(`HTTP ${response.statusCode}: Failed to fetch articles`);
      }

      const text = new TextDecoder().decode(response.body);
      const data: ArticlesResponse = JSON.parse(text);

      if (!data.success) {
        throw new Error('API returned error status');
      }

      return data.articles;
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      throw error;
    }
  }

  // Convert Dev Digest Article to legacy NewsArticle format for backward compatibility
  convertToNewsArticle(article: Article): NewsArticle {
    return {
      source: {
        id: article.source,
        name: article.source,
      },
      author: article.author || null,
      title: article.title,
      description: article.description || null,
      url: article.url,
      urlToImage: article.imageUrl || null,
      publishedAt: article.publishedAt,
      content: null,
    };
  }
}
