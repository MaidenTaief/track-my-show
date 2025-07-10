import { firestore } from 'firebase-admin';
import { Article, CreateArticleRequest, UpdateArticleRequest, ArticleFilter } from '../models/Article';
import { Logger } from '../utils/Logger';

// Fallback in-memory storage
let inMemoryArticles: Article[] = [];
let nextId = 1;

// Helper function to get Firestore instance
const getFirestore = () => {
  try {
    return firestore();
  } catch (error) {
    Logger.warn('Firestore not available, falling back to in-memory storage');
    return null;
  }
};

export class ArticleService {
  // Get all articles with filtering and pagination
  async getArticles(filter?: ArticleFilter): Promise<{ articles: Article[]; pagination: any }> {
    try {
      const db = getFirestore();
      if (db) {
        // Use Firestore
        const articlesCollection = db.collection('articles');
        let query: firestore.Query = articlesCollection;

        // Apply filters
        if (filter?.status && filter.status !== 'all') {
          query = query.where('status', '==', filter.status);
        }

        if (filter?.author) {
          query = query.where('author', '==', filter.author);
        }

        if (filter?.tags && filter.tags.length > 0) {
          query = query.where('tags', 'array-contains-any', filter.tags);
        }

        // Apply sorting
        const sortBy = filter?.sortBy || 'createdAt';
        const sortOrder = filter?.sortOrder || 'desc';
        query = query.orderBy(sortBy, sortOrder);

        // Apply pagination
        const page = filter?.page || 1;
        const limit = filter?.limit || 10;
        const offset = (page - 1) * limit;
        
        query = query.limit(limit).offset(offset);

        const snapshot = await query.get();
        
        const articles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Article));

        // Get total count for pagination
        const totalSnapshot = await articlesCollection.count().get();
        const totalItems = totalSnapshot.data().count;
        const totalPages = Math.ceil(totalItems / limit);

        return {
          articles,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        };
      } else {
        // Use in-memory storage
        let filteredArticles = [...inMemoryArticles];

        // Apply filters
        if (filter?.status && filter.status !== 'all') {
          filteredArticles = filteredArticles.filter(article => article.status === filter.status);
        }

        if (filter?.author) {
          filteredArticles = filteredArticles.filter(article => article.author === filter.author);
        }

        if (filter?.tags && filter.tags.length > 0) {
          filteredArticles = filteredArticles.filter(article => 
            article.tags?.some(tag => filter.tags!.includes(tag))
          );
        }

        // Apply sorting
        const sortBy = filter?.sortBy || 'createdAt';
        const sortOrder = filter?.sortOrder || 'desc';
        filteredArticles.sort((a, b) => {
          const aValue = a[sortBy as keyof Article] || '';
          const bValue = b[sortBy as keyof Article] || '';
          if (sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });

        // Apply pagination
        const page = filter?.page || 1;
        const limit = filter?.limit || 10;
        const offset = (page - 1) * limit;
        const paginatedArticles = filteredArticles.slice(offset, offset + limit);

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
      }
    } catch (error) {
      Logger.error('Error getting articles:', error);
      throw error;
    }
  }

  // Get published articles for public view
  async getPublishedArticles(filter?: Omit<ArticleFilter, 'status'>): Promise<{ articles: Article[]; pagination: any }> {
    try {
      const db = getFirestore();
      if (db) {
        // Use Firestore
        const articlesCollection = db.collection('articles');
        let query: firestore.Query = articlesCollection.where('status', '==', 'published');

        // Apply search filter
        if (filter?.search) {
          // Note: Firestore doesn't support full-text search natively
          // You might want to use Algolia or similar for better search
          // For now, we'll filter client-side
        }

        if (filter?.tags && filter.tags.length > 0) {
          query = query.where('tags', 'array-contains-any', filter.tags);
        }

        // Apply sorting
        const sortBy = filter?.sortBy || 'publishedAt';
        const sortOrder = filter?.sortOrder || 'desc';
        query = query.orderBy(sortBy, sortOrder);

        // Apply pagination
        const page = filter?.page || 1;
        const limit = filter?.limit || 10;
        const offset = (page - 1) * limit;
        
        query = query.limit(limit).offset(offset);

        const snapshot = await query.get();
        
        const articles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Article));

        // Get total count for pagination
        const totalSnapshot = await articlesCollection.where('status', '==', 'published').count().get();
        const totalItems = totalSnapshot.data().count;
        const totalPages = Math.ceil(totalItems / limit);

        return {
          articles,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        };
      } else {
        // Use in-memory storage
        let filteredArticles = inMemoryArticles.filter(article => article.status === 'published');

        if (filter?.tags && filter.tags.length > 0) {
          filteredArticles = filteredArticles.filter(article => 
            article.tags?.some(tag => filter.tags!.includes(tag))
          );
        }

        // Apply sorting
        const sortBy = filter?.sortBy || 'publishedAt';
        const sortOrder = filter?.sortOrder || 'desc';
        filteredArticles.sort((a, b) => {
          const aValue = a[sortBy as keyof Article] || '';
          const bValue = b[sortBy as keyof Article] || '';
          if (sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1;
          }
          return aValue > bValue ? 1 : -1;
        });

        // Apply pagination
        const page = filter?.page || 1;
        const limit = filter?.limit || 10;
        const offset = (page - 1) * limit;
        const paginatedArticles = filteredArticles.slice(offset, offset + limit);

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
      }
    } catch (error) {
      Logger.error('Error getting published articles:', error);
      throw error;
    }
  }

  // Get article by ID
  async getArticleById(id: string): Promise<Article | null> {
    try {
      const db = getFirestore();
      if (db) {
        // Use Firestore
        const articlesCollection = db.collection('articles');
        const doc = await articlesCollection.doc(id).get();
        if (!doc.exists) {
          return null;
        }
        return { id: doc.id, ...doc.data() } as Article;
      } else {
        // Use in-memory storage
        return inMemoryArticles.find(article => article.id === id) || null;
      }
    } catch (error) {
      Logger.error('Error getting article by ID:', error);
      throw error;
    }
  }

  // Get article by slug
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const db = getFirestore();
      if (db) {
        // Use Firestore
        const articlesCollection = db.collection('articles');
        const snapshot = await articlesCollection.where('slug', '==', slug).limit(1).get();
        if (snapshot.empty) {
          return null;
        }
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Article;
      } else {
        // Use in-memory storage
        return inMemoryArticles.find(article => article.slug === slug) || null;
      }
    } catch (error) {
      Logger.error('Error getting article by slug:', error);
      throw error;
    }
  }

  // Create new article
  async createArticle(articleData: CreateArticleRequest, userId: string): Promise<Article> {
    try {
      const now = new Date();
      const slug = this.generateSlug(articleData.title);
      
      const articleWithMetadata = {
        ...articleData,
        slug,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        publishedAt: articleData.status === 'published' ? now : null
      };

      const db = getFirestore();
      if (db) {
        // Use Firestore
        const articlesCollection = db.collection('articles');
        const docRef = await articlesCollection.add(articleWithMetadata);
        return {
          id: docRef.id,
          ...articleWithMetadata
        } as Article;
      } else {
        // Use in-memory storage
        const newArticle: Article = {
          id: nextId.toString(),
          ...articleWithMetadata
        } as Article;
        inMemoryArticles.push(newArticle);
        nextId++;
        return newArticle;
      }
    } catch (error) {
      Logger.error('Error creating article:', error);
      throw error;
    }
  }

  // Update article
  async updateArticle(id: string, updateData: UpdateArticleRequest, userId: string): Promise<Article | null> {
    try {
      const db = getFirestore();
      if (db) {
        // Use Firestore
        const articlesCollection = db.collection('articles');
        const docRef = articlesCollection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
          return null;
        }

        const now = new Date();
        const updatePayload: any = {
          ...updateData,
          updatedAt: now,
          updatedBy: userId
        };

        // Update publishedAt if status is changing to published
        if (updateData.status === 'published') {
          updatePayload.publishedAt = now;
        }

        await docRef.update(updatePayload);

        const updatedDoc = await docRef.get();
        return { id: updatedDoc.id, ...updatedDoc.data() } as Article;
      } else {
        // Use in-memory storage
        const index = inMemoryArticles.findIndex(article => article.id === id);
        if (index === -1) {
          return null;
        }

        const now = new Date();
        const updatePayload: any = {
          ...updateData,
          updatedAt: now,
          updatedBy: userId
        };

        // Update publishedAt if status is changing to published
        if (updateData.status === 'published') {
          updatePayload.publishedAt = now;
        }

        inMemoryArticles[index] = {
          ...inMemoryArticles[index],
          ...updatePayload
        };

        return inMemoryArticles[index];
      }
    } catch (error) {
      Logger.error('Error updating article:', error);
      throw error;
    }
  }

  // Delete article
  async deleteArticle(id: string): Promise<boolean> {
    try {
      const db = getFirestore();
      if (db) {
        // Use Firestore
        const articlesCollection = db.collection('articles');
        const docRef = articlesCollection.doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
          return false;
        }

        await docRef.delete();
        return true;
      } else {
        // Use in-memory storage
        const index = inMemoryArticles.findIndex(article => article.id === id);
        if (index === -1) {
          return false;
        }

        inMemoryArticles.splice(index, 1);
        return true;
      }
    } catch (error) {
      Logger.error('Error deleting article:', error);
      throw error;
    }
  }

  // Get all unique tags
  async getArticleTags(): Promise<string[]> {
    try {
      const db = getFirestore();
      if (db) {
        // Use Firestore
        const articlesCollection = db.collection('articles');
        const snapshot = await articlesCollection.get();
        const tags = new Set<string>();
        
        snapshot.docs.forEach(doc => {
          const article = doc.data() as Article;
          if (article.tags) {
            article.tags.forEach(tag => tags.add(tag));
          }
        });

        return Array.from(tags);
      } else {
        // Use in-memory storage
        const tags = new Set<string>();
        inMemoryArticles.forEach(article => {
          if (article.tags) {
            article.tags.forEach(tag => tags.add(tag));
          }
        });
        return Array.from(tags);
      }
    } catch (error) {
      Logger.error('Error getting article tags:', error);
      throw error;
    }
  }

  // Generate URL-friendly slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
} 