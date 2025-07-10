import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { storageService, UploadResponse } from '../../services/storageService';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUpload: (files: UploadResponse[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  folder?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  multiple = false,
  accept = "image/*",
  maxSize = 10,
  folder,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size: ${maxSize}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const uploadedFiles = await storageService.uploadMultiple(validFiles, folder);
      onUpload(uploadedFiles);
      toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-600 hover:border-gray-500'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        {uploading ? (
          <div className="text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Uploading...</p>
          </div>
        ) : (
          <div className="text-gray-400">
            <Upload size={48} className="mx-auto mb-4" />
            <p className="text-lg mb-2">
              {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm">
              {accept.includes('image') ? 'Images' : 'Files'} up to {maxSize}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload; 