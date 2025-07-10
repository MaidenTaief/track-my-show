import { Request, Response } from 'express';
import { ArticleService } from '../services/ArticleService';
import { CreateArticleRequest, UpdateArticleRequest, ArticleFilter } from '../models/Article';
import { Logger } from '../utils/Logger';
import { asyncHandler } from '../middleware/errorHandler';

const articleService = new ArticleService();

export class ArticleController {
  // GET /api/articles - Get all articles (admin view with filters)
  getArticles = asyncHandler(async (req: Request, res: Response) => {
    const filter: ArticleFilter = {
      status: req.query.status as 'draft' | 'published' | 'all',
      author: req.query.author as string,
      search: req.query.search as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: req.query.sortBy as 'createdAt' | 'updatedAt' | 'publishedAt' | 'title',
      sortOrder: req.query.sortOrder as 'asc' | 'desc'
    };

    const result = await articleService.getArticles(filter);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Articles fetched successfully'
    });
  });

  // GET /api/articles/published - Get published articles (public view)
  getPublishedArticles = asyncHandler(async (req: Request, res: Response) => {
    const filter = {
      search: req.query.search as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: req.query.sortBy as 'createdAt' | 'updatedAt' | 'publishedAt' | 'title',
      sortOrder: req.query.sortOrder as 'asc' | 'desc'
    };

    const result = await articleService.getPublishedArticles(filter);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Published articles fetched successfully'
    });
  });

  // GET /api/articles/:id - Get article by ID
  getArticleById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const article = await articleService.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.status(200).json({
      success: true,
      data: article,
      message: 'Article fetched successfully'
    });
  });

  // GET /api/articles/slug/:slug - Get article by slug (public view)
  getArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const article = await articleService.getArticleBySlug(slug);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Only return published articles for public view
    if (article.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.status(200).json({
      success: true,
      data: article,
      message: 'Article fetched successfully'
    });
  });

  // POST /api/articles - Create new article
  createArticle = asyncHandler(async (req: Request, res: Response) => {
    const articleData: CreateArticleRequest = req.body;
    
    // Validate required fields
    if (!articleData.title || !articleData.author || !articleData.description) {
      return res.status(400).json({
        success: false,
        message: 'Title, author, and description are required'
      });
    }

    // Mock user ID (replace with actual user from auth middleware)
    const userId = req.body.userId || 'admin-1';

    const article = await articleService.createArticle(articleData, userId);

    res.status(201).json({
      success: true,
      data: article,
      message: 'Article created successfully'
    });
  });

  // PUT /api/articles/:id - Update article
  updateArticle = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData: UpdateArticleRequest = req.body;

    // Mock user ID (replace with actual user from auth middleware)
    const userId = req.body.userId || 'admin-1';

    const article = await articleService.updateArticle(id, updateData, userId);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.status(200).json({
      success: true,
      data: article,
      message: 'Article updated successfully'
    });
  });

  // DELETE /api/articles/:id - Delete article
  deleteArticle = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await articleService.deleteArticle(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  });

  // GET /api/articles/tags - Get all article tags
  getArticleTags = asyncHandler(async (req: Request, res: Response) => {
    const tags = await articleService.getArticleTags();

    res.status(200).json({
      success: true,
      data: tags,
      message: 'Tags fetched successfully'
    });
  });

  // PATCH /api/articles/:id/status - Update article status (publish/unpublish)
  updateArticleStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['draft', 'published'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (draft or published) is required'
      });
    }

    // Mock user ID (replace with actual user from auth middleware)
    const userId = req.body.userId || 'admin-1';

    const article = await articleService.updateArticle(id, { status }, userId);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.status(200).json({
      success: true,
      data: article,
      message: `Article ${status === 'published' ? 'published' : 'unpublished'} successfully`
    });
  });
} 