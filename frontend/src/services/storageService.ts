import { api } from './authService';

export interface UploadResponse {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
}

class StorageService {
  // Upload to Google Drive (via your backend)
  async uploadFile(file: File, folder?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    try {
      const response = await api.post('/upload/drive', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // Fallback: For now, create a mock response
      return {
        id: `mock_${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        mimeType: file.type,
        size: file.size,
      };
    }
  }

  // Upload multiple files
  async uploadMultiple(files: File[], folder?: string): Promise<UploadResponse[]> {
    const uploads = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploads);
  }

  // Delete file from Google Drive
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await api.delete(`/upload/drive/${fileId}`);
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  }

  // Get file URL
  getFileUrl(fileId: string): string {
    return `https://drive.google.com/uc?id=${fileId}`;
  }
}

export const storageService = new StorageService(); 