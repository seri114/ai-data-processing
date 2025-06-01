"use client"

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, FileText, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: 'csv' | 'xlsx';
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

const FileUploadComponent: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'CSVまたはXLSXファイルのみアップロード可能です' };
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB制限
      return { isValid: false, error: 'ファイルサイズは10MB以下にしてください' };
    }
    return { isValid: true };
  };

  const getFileType = (file: File): 'csv' | 'xlsx' => {
    return file.type === 'text/csv' ? 'csv' : 'xlsx';
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newFiles: UploadedFile[] = [];

    fileArray.forEach((file) => {
      const validation = validateFile(file);
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      newFiles.push({
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        type: getFileType(file),
        status: validation.isValid ? 'success' : 'error',
        errorMessage: validation.error
      });
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const successFiles = uploadedFiles.filter(f => f.status === 'success');
  const errorFiles = uploadedFiles.filter(f => f.status === 'error');

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ファイルアップロード</h2>
        <p className="text-gray-600">CSV・XLSXファイルを複数選択してアップロードできます</p>
      </div>

      {/* アップロード領域 */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              ファイルをドラッグ&ドロップ
            </p>
            <p className="text-sm text-gray-500 mt-1">
              または <span className="text-blue-600 font-medium">クリックしてファイルを選択</span>
            </p>
          </div>
          <div className="text-xs text-gray-500">
            <p>対応形式: CSV, XLSX</p>
            <p>最大ファイルサイズ: 10MB</p>
          </div>
        </div>
      </div>

      {/* 統計情報 */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6 text-sm">
              <span className="text-gray-600">
                総ファイル数: <span className="font-medium text-gray-900">{uploadedFiles.length}</span>
              </span>
              <span className="text-green-600">
                成功: <span className="font-medium">{successFiles.length}</span>
              </span>
              {errorFiles.length > 0 && (
                <span className="text-red-600">
                  エラー: <span className="font-medium">{errorFiles.length}</span>
                </span>
              )}
            </div>
            <button
              onClick={clearAllFiles}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              全て削除
            </button>
          </div>
        </div>
      )}

      {/* ファイル一覧 */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-medium text-gray-900">アップロードファイル</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  file.status === 'success'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {file.type === 'csv' ? (
                      <FileText className="w-8 h-8 text-blue-500" />
                    ) : (
                      <FileSpreadsheet className="w-8 h-8 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="uppercase">{file.type}</span>
                    </div>
                    {file.status === 'error' && file.errorMessage && (
                      <p className="text-xs text-red-600 mt-1">{file.errorMessage}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* アクションボタン */}
      {successFiles.length > 0 && (
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
            キャンセル
          </button>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            処理開始 ({successFiles.length}件)
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;