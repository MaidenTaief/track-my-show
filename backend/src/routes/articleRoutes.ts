import { Router } from 'express';
import { ArticleController } from '../controllers/ArticleController';

const router = Router();
const articleController = new ArticleController();

// Admin routes (require authentication in real app)
router.get('/', articleController.getArticles);
router.get('/tags', articleController.getArticleTags);
router.get('/:id', articleController.getArticleById);
router.post('/', articleController.createArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);
router.patch('/:id/status', articleController.updateArticleStatus);

// Public routes
router.get('/published/list', articleController.getPublishedArticles);
router.get('/slug/:slug', articleController.getArticleBySlug);

export default router; 