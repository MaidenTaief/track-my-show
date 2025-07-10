import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { Upload, Save, X } from 'lucide-react';
import { articleService, CreateArticleRequest, UpdateArticleRequest, Article } from '../../services/articleService';

const ArticleEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: '',
    author: '',
    description: '',
    content: '',
    coverImage: '',
    tags: [],
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  // Load article data if editing
  useEffect(() => {
    if (isEditing && id) {
      loadArticle();
    }
  }, [id, isEditing]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticleById(id!);
      const article = response.data;
      
      setFormData({
        title: article.title,
        author: article.author,
        description: article.description,
        content: article.content || '',
        coverImage: article.coverImage || '',
        tags: article.tags,
        status: article.status
      });
    } catch (err) {
      setError('Failed to load article');
      console.error('Error loading article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateArticleRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      handleInputChange('tags', [...(formData.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  const handleSave = async (publish: boolean = false) => {
    if (!formData.title || !formData.author || !formData.description) {
      setError('Title, author, and description are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const dataToSave = {
        ...formData,
        status: publish ? 'published' : formData.status
      };

      if (isEditing) {
        await articleService.updateArticle(id!, dataToSave as UpdateArticleRequest);
      } else {
        await articleService.createArticle(dataToSave);
      }

      navigate('/admin/articles');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} article`);
      console.error('Error saving article:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/articles');
  };

  if (loading) {
    return (
      <AdminLayout title="Articles">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading article...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      showBackButton
      title={isEditing ? 'Edit Article' : 'New Article'}
      rightActions={
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Status: {formData.status}</span>
          <button 
            onClick={handleCancel}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button 
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            Save Draft
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      }
    >
      <div className="max-w-4xl space-y-8">
        {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Title*</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter article title"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Author*</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter author name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Description*</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white resize-none"
            placeholder="Enter article description"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={8}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white resize-none"
            placeholder="Enter article content"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Tags</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags?.map((tag, index) => (
              <span key={index} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              placeholder="Add a tag"
            />
            <button
              onClick={handleAddTag}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Cover Image URL</label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => handleInputChange('coverImage', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter cover image URL"
          />
          {formData.coverImage && (
            <div className="mt-3">
              <img 
                src={formData.coverImage} 
                alt="Cover preview" 
                className="w-32 h-32 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ArticleEditor; 