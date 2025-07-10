import { v4 as uuidv4 } from 'uuid';
import { Article, CreateArticleRequest, UpdateArticleRequest, ArticleFilter } from '../models/Article';
import { Logger } from '../utils/Logger';

// In-memory storage for development (replace with database later)
let articles: Article[] = [
  {
    id: '1',
    title: "'Tirthojatri' stages successful run in Dhaka after New York",
    author: 'Author name',
    description: '"Tirthojatri", directed by Tauquir Ahmed, took the stage at the Bangladesh Shilpakala Academy in Dhaka recently. This production marks...',
    content: `Manjubur Rahman completed his MFA in Drawing and Painting at the Institute of Fine Art of the University of Dhaka. He has had a number of solo exhibitions and projects in exhibitions around the world, throughout his career.\n\nHis major public collections are in Kunsthaus Zürich; Neue Gallery, Kassel; Gural Foundation; Kiran Nadar Museum of Art; JSW Foundation; Harmony Art Foundation and Devi Art Foundation, India; Bengal Foundation; Bangladesh Shilpakala Academy; Ministry of Foreign Affairs and Samacar Art Foundation, Bangladesh; Fukuoka Art Museum and LO-FTF Council Denmark.\n\nRahman participated in several workshops in India, Sikkim, China, Sri Lanka, UK, Nepal, Japan, Thailand, and Bangladesh and he has experience joining artists residences across the globe.`,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    status: 'published',
    slug: 'tirthojatri-stages-successful-run-dhaka-new-york',
    tags: ['theatre', 'dhaka', 'performance'],
    publishedAt: new Date('2023-09-28'),
    createdAt: new Date('2023-09-28'),
    updatedAt: new Date('2023-09-29'),
    createdBy: 'admin-1',
    updatedBy: 'admin-1'
  },
  {
    id: '2',
    title: "Shastriosongeet Abong Nritya Utshar 2023 to begin tomorrow",
    author: 'Author name',
    description: '"Tirthojatri", directed by Tauquir Ahmed, took the stage at the Bangladesh Shilpakala Academy in Dhaka recently. This production marks...',
    content: 'Full content for Shastriosongeet article...',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    status: 'draft',
    slug: 'shastriosongeet-abong-nritya-utshar-2023',
    tags: ['music', 'dance', 'festival'],
    createdAt: new Date('2023-09-28'),
    updatedAt: new Date('2023-09-29'),
    createdBy: 'admin-1',
    updatedBy: 'admin-1'
  },
  {
    id: '3',
    title: "Celebrating the best of art",
    author: 'Author name',
    description: '"Tirthojatri", directed by Tauquir Ahmed, took the stage at the Bangladesh Shilpakala Academy in Dhaka recently. This production marks...',
    content: 'Full content for art celebration article...',
    coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    status: 'draft',
    slug: 'celebrating-best-of-art',
    tags: ['art', 'exhibition', 'culture'],
    createdAt: new Date('2023-09-28'),
    updatedAt: new Date('2023-09-29'),
    createdBy: 'admin-1',
    updatedBy: 'admin-1'
  },
  {
    id: '4',
    title: "Korjo dhulo moyda jayna",
    author: 'Author name',
    description: '"Tirthojatri", directed by Tauquir Ahmed, took the stage at the Bangladesh Shilpakala Academy in Dhaka recently. This production marks...',
    content: 'Full content for this article...',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    status: 'published',
    slug: 'korjo-dhulo-moyda-jayna',
    tags: ['culture', 'tradition'],
    publishedAt: new Date('2023-09-28'),
    createdAt: new Date('2023-09-28'),
    updatedAt: new Date('2023-09-29'),
    createdBy: 'admin-1',
    updatedBy: 'admin-1'
  },
  {
    id: '5',
    title: "Tumi robo niroboe",
    author: 'Author name',
    description: '"Tirthojatri", directed by Tauquir Ahmed, took the stage at the Bangladesh Shilpakala Academy in Dhaka recently. This production marks...',
    content: 'Full content for this article...',
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    status: 'published',
    slug: 'tumi-robo-niroboe',
    tags: ['poetry', 'literature'],
    publishedAt: new Date('2023-09-28'),
    createdAt: new Date('2023-09-28'),
    updatedAt: new Date('2023-09-29'),
    createdBy: 'admin-1',
    updatedBy: 'admin-1'
  }
];

export class ArticleService {
  // Generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  // Create new article
  async createArticle(data: CreateArticleRequest, userId: string): Promise<Article> {
    try {
      const newArticle: Article = {
        id: uuidv4(),
        title: data.title,
        author: data.author,
        description: data.description,
        content: data.content,
        coverImage: data.coverImage,
        status: data.status,
        slug: this.generateSlug(data.title),
        tags: data.tags || [],
        publishedAt: data.status === 'published' ? new Date() : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        updatedBy: userId
      };

      articles.push(newArticle);
      Logger.info(`Article created: ${newArticle.id} - ${newArticle.title}`);
      
      return newArticle;
    } catch (error) {
      Logger.error('Error creating article:', error);
      throw new Error('Failed to create article');
    }
  }

  // Get all articles with filtering and pagination
  async getArticles(filter: ArticleFilter = {}) {
    try {
      let filteredArticles = [...articles];

      // Filter by status
      if (filter.status && filter.status !== 'all') {
        filteredArticles = filteredArticles.filter(article => article.status === filter.status);
      }

      // Filter by author
      if (filter.author) {
        filteredArticles = filteredArticles.filter(article => 
          article.author.toLowerCase().includes(filter.author!.toLowerCase())
        );
      }

      // Search in title and description
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredArticles = filteredArticles.filter(article =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.description.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by tags
      if (filter.tags && filter.tags.length > 0) {
        filteredArticles = filteredArticles.filter(article =>
          filter.tags!.some(tag => article.tags.includes(tag))
        );
      }

      // Sort articles
      const sortBy = filter.sortBy || 'updatedAt';
      const sortOrder = filter.sortOrder || 'desc';
      
      filteredArticles.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (aValue instanceof Date) aValue = aValue.getTime();
        if (bValue instanceof Date) bValue = bValue.getTime();
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Pagination
      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
      const totalItems = filteredArticles.length;
      const totalPages = Math.ceil(totalItems / limit);

      return {
        articles: paginatedArticles,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      Logger.error('Error fetching articles:', error);
      throw new Error('Failed to fetch articles');
    }
  }

  // Get article by ID
  async getArticleById(id: string): Promise<Article | null> {
    try {
      const article = articles.find(a => a.id === id);
      return article || null;
    } catch (error) {
      Logger.error('Error fetching article by ID:', error);
      throw new Error('Failed to fetch article');
    }
  }

  // Get article by slug
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const article = articles.find(a => a.slug === slug);
      return article || null;
    } catch (error) {
      Logger.error('Error fetching article by slug:', error);
      throw new Error('Failed to fetch article');
    }
  }

  // Update article
  async updateArticle(id: string, data: UpdateArticleRequest, userId: string): Promise<Article | null> {
    try {
      const articleIndex = articles.findIndex(a => a.id === id);
      
      if (articleIndex === -1) {
        return null;
      }

      const existingArticle = articles[articleIndex];
      const updatedArticle: Article = {
        ...existingArticle,
        ...data,
        slug: data.title ? this.generateSlug(data.title) : existingArticle.slug,
        publishedAt: data.status === 'published' && existingArticle.status !== 'published' 
          ? new Date() 
          : existingArticle.publishedAt,
        updatedAt: new Date(),
        updatedBy: userId
      };

      articles[articleIndex] = updatedArticle;
      Logger.info(`Article updated: ${updatedArticle.id} - ${updatedArticle.title}`);
      
      return updatedArticle;
    } catch (error) {
      Logger.error('Error updating article:', error);
      throw new Error('Failed to update article');
    }
  }

  // Delete article
  async deleteArticle(id: string): Promise<boolean> {
    try {
      const articleIndex = articles.findIndex(a => a.id === id);
      
      if (articleIndex === -1) {
        return false;
      }

      const deletedArticle = articles[articleIndex];
      articles.splice(articleIndex, 1);
      Logger.info(`Article deleted: ${deletedArticle.id} - ${deletedArticle.title}`);
      
      return true;
    } catch (error) {
      Logger.error('Error deleting article:', error);
      throw new Error('Failed to delete article');
    }
  }

  // Get published articles for public view
  async getPublishedArticles(filter: Omit<ArticleFilter, 'status'> = {}) {
    return this.getArticles({ ...filter, status: 'published' });
  }

  // Get article tags
  async getArticleTags(): Promise<string[]> {
    try {
      const allTags = articles.reduce((tags, article) => {
        return [...tags, ...article.tags];
      }, [] as string[]);
      
      return [...new Set(allTags)].sort();
    } catch (error) {
      Logger.error('Error fetching article tags:', error);
      throw new Error('Failed to fetch tags');
    }
  }
} 