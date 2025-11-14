import { HTTPClient } from 'valdi_http/src/HTTPClient';
import { HTTPResponse } from 'valdi_http/src/HTTPTypes';

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

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

const DEFAULT_PAGE_SIZE = 100;

export class NewsAPIService {
  private baseURL = 'https://newsapi.org/v2';
  private httpClient: HTTPClient;

  constructor(private apiKey: string) {
    this.httpClient = new HTTPClient(this.baseURL);
  }

  async getTopHeadlines(country: string = 'us', category?: string, page: number = 1, pageSize: number = DEFAULT_PAGE_SIZE): Promise<NewsArticle[]> {
    try {
      let path = `/top-headlines?country=${country}&apiKey=${this.apiKey}&page=${page}&pageSize=${pageSize}`;
      if (category) {
        path += `&category=${category}`;
      }

      const headers = {
        'User-Agent': 'NewsApp/1.0'
      };

      const response: HTTPResponse = await this.httpClient.get(path, headers);

      if (response.statusCode !== 200) {
        throw new Error(`HTTP ${response.statusCode}: Failed to fetch news`);
      }

      const text = new TextDecoder().decode(response.body);
      const data: NewsAPIResponse = JSON.parse(text);

      if (data.status !== 'ok') {
        throw new Error('NewsAPI returned an error status');
      }

      return data.articles;
    } catch (error) {
      console.error('Failed to fetch news:', error);
      throw error;
    }
  }

  async searchNews(query: string, page: number = 1, pageSize: number = DEFAULT_PAGE_SIZE): Promise<NewsArticle[]> {
    try {
      const path = `/everything?q=${encodeURIComponent(query)}&apiKey=${this.apiKey}&sortBy=publishedAt&page=${page}&pageSize=${pageSize}`;
      
      const headers = {
        'User-Agent': 'NewsApp/1.0'
      };
      
      const response: HTTPResponse = await this.httpClient.get(path, headers);

      if (response.statusCode !== 200) {
        throw new Error(`HTTP ${response.statusCode}: Failed to search news`);
      }

      const text = new TextDecoder().decode(response.body);
      const data: NewsAPIResponse = JSON.parse(text);

      if (data.status !== 'ok') {
        throw new Error('NewsAPI returned an error status');
      }

      return data.articles;
    } catch (error) {
      console.error('Failed to search news:', error);
      throw error;
    }
  }
}
