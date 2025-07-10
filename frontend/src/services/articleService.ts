const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Article {
  id: string;
  title: string;
  author: string;
  description: string;
  content?: string;
  coverImage?: string;
  status: 'draft' | 'published';
  slug: string;
  tags: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateArticleRequest {
  title: string;
  author: string;
  description: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}

export interface UpdateArticleRequest {
  title?: string;
  author?: string;
  description?: string;
  content?: string;
  coverImage?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}

export interface ArticleFilter {
  status?: 'draft' | 'published' | 'all';
  author?: string;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

class ArticleService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}/articles${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get all articles (admin view)
  async getArticles(filter?: ArticleFilter): Promise<{ success: boolean; data: { articles: Article[]; pagination: any }; message: string }> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `?${queryString}` : '';
    
    return this.request(endpoint);
  }

  // Get published articles (public view)
  async getPublishedArticles(filter?: Omit<ArticleFilter, 'status'>): Promise<{ success: boolean; data: { articles: Article[]; pagination: any }; message: string }> {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/published/list${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  // Get article by ID
  async getArticleById(id: string): Promise<{ success: boolean; data: Article; message: string }> {
    return this.request(`/${id}`);
  }

  // Get article by slug
  async getArticleBySlug(slug: string): Promise<{ success: boolean; data: Article; message: string }> {
    return this.request(`/slug/${slug}`);
  }

  // Create new article
  async createArticle(articleData: CreateArticleRequest): Promise<{ success: boolean; data: Article; message: string }> {
    return this.request('', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  // Update article
  async updateArticle(id: string, updateData: UpdateArticleRequest): Promise<{ success: boolean; data: Article; message: string }> {
    return this.request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Delete article
  async deleteArticle(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/${id}`, {
      method: 'DELETE',
    });
  }

  // Update article status
  async updateArticleStatus(id: string, status: 'draft' | 'published'): Promise<{ success: boolean; data: Article; message: string }> {
    return this.request(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Get article tags
  async getArticleTags(): Promise<{ success: boolean; data: string[]; message: string }> {
    return this.request('/tags');
  }
}

export const articleService = new ArticleService(); 