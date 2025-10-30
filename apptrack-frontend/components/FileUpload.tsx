'use client';

import { useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import api from '@/lib/api';
import { formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  applicationId: string;
  onUploadComplete?: () => void;
}

export function FileUpload({ applicationId, onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const allowedTypes = ['application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'text/plain'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('doc_type', 'other');

    try {
      await api.post(`/applications/${applicationId}/attachments/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
        },
      });

      setSelectedFile(null);
      setProgress(0);
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <label htmlFor="file-upload">
          <Button type="button" variant="outline" disabled={uploading} asChild>
            <span>
              <Upload className="mr-2 h-4 w-4" />
              Select File
            </span>
          </Button>
        </label>

        {selectedFile && (
          <div className="flex items-center gap-2 flex-1">
            <File className="h-4 w-4" />
            <span className="text-sm truncate">{selectedFile.name}</span>
            <span className="text-sm text-muted-foreground">
              ({formatFileSize(selectedFile.size)})
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedFile(null)}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {selectedFile && !uploading && (
        <Button onClick={handleUpload} className="w-full">
          Upload File
        </Button>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            Uploading... {progress}%
          </p>
        </div>
      )}
    </div>
  );
}