import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { Search, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';
import { articleService, Article, ArticleFilter } from '../../services/articleService';

const ArticlesManager = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Load articles on component mount
  useEffect(() => {
    loadArticles();
  }, [selectedFilter]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filter: ArticleFilter = {
        status: selectedFilter === 'all' ? 'all' : selectedFilter,
        search: searchQuery || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await articleService.getArticles(filter);
      setArticles(response.data.articles);
    } catch (err) {
      setError('Failed to load articles');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadArticles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await articleService.deleteArticle(id);
      setArticles(articles.filter(article => article.id !== id));
    } catch (err) {
      setError('Failed to delete article');
      console.error('Error deleting article:', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'draft' | 'published') => {
    try {
      await articleService.updateArticleStatus(id, newStatus);
      setArticles(articles.map(article => 
        article.id === id ? { ...article, status: newStatus } : article
      ));
    } catch (err) {
      setError('Failed to update article status');
      console.error('Error updating article status:', err);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'text-green-400' : 'text-purple-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Articles">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading articles...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Articles"
      rightActions={
        <button 
          onClick={() => navigate('/admin/articles/new')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} />
          New article
        </button>
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                className="bg-gray-700 border border-gray-600 text-white px-4 py-2 pr-8 rounded appearance-none min-w-[120px]"
                value={selectedFilter}
                onChange={e => setSelectedFilter(e.target.value as 'all' | 'published' | 'draft')}
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search an article here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-gray-700 border border-gray-600 text-white px-4 py-2 pr-10 rounded w-80 placeholder-gray-400"
              />
              <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button 
              onClick={handleSearch}
              className="text-gray-400 hover:text-white border border-gray-600 px-4 py-2 rounded"
            >
              Search
            </button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Title</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Created</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Modified</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Published</th>
                <th className="text-left px-6 py-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No articles found
                  </td>
                </tr>
              ) : (
                articles.map((article, index) => (
                  <tr key={article.id} className={`${index !== articles.length - 1 ? 'border-b border-gray-700' : ''} hover:bg-gray-750 transition-colors`}>
                    <td className="px-6 py-4">
                      <div 
                        className="text-white hover:text-orange-400 cursor-pointer"
                        onClick={() => navigate(`/admin/articles/${article.id}`)}
                      >
                        {article.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${getStatusColor(article.status)}`}>
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        <span className="capitalize">{article.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(article.createdAt)}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(article.updatedAt)}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {article.publishedAt ? formatDate(article.publishedAt) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/articles/${article.id}`)}
                          className="text-gray-400 hover:text-white p-1"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-gray-400 hover:text-red-400 p-1"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        {article.status === 'draft' && (
                          <button
                            onClick={() => handleStatusChange(article.id, 'published')}
                            className="text-gray-400 hover:text-green-400 p-1"
                            title="Publish"
                          >
                            Publish
                          </button>
                        )}
                        {article.status === 'published' && (
                          <button
                            onClick={() => handleStatusChange(article.id, 'draft')}
                            className="text-gray-400 hover:text-yellow-400 p-1"
                            title="Unpublish"
                          >
                            Unpublish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ArticlesManager;
