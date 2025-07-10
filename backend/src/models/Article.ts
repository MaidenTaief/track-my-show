export interface Article {
  id: string;
  title: string;
  author: string;
  description: string;
  content: string;
  coverImage?: string;
  status: 'draft' | 'published';
  slug: string;
  tags: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  updatedBy: string; // User ID
}

export interface CreateArticleRequest {
  title: string;
  author: string;
  description: string;
  content: string;
  coverImage?: string;
  status: 'draft' | 'published';
  tags: string[];
}

export interface UpdateArticleRequest {
  title?: string;
  author?: string;
  description?: string;
  content?: string;
  coverImage?: string;
  status?: 'draft' | 'published';
  tags?: string[];
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

export interface ArticleResponse {
  success: boolean;
  data: Article;
  message?: string;
}

export interface ArticlesListResponse {
  success: boolean;
  data: {
    articles: Article[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message?: string;
} 