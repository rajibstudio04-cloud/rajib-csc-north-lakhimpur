import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Eye, 
  Image as ImageIcon,
  File
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DocumentUploader = ({ 
  docRequirement, 
  docId, 
  label, 
  required, 
  onFileChange, 
  onUploaded, 
  uploadedFile, 
  existingDoc 
}) => {
  const { t } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  // Resolve values flexibly regardless of caller syntax
  const effectiveId = docRequirement?.id || docId || 'doc';
  const effectiveName = docRequirement?.name || label || 'Document';
  const isRequired = docRequirement?.required ?? required ?? false;
  const currentFile = uploadedFile || existingDoc || null;

  const handleNotify = (id, fileData) => {
    if (typeof onFileChange === 'function') {
      onFileChange(id, fileData);
    } else if (typeof onUploaded === 'function') {
      onUploaded(id, fileData);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    setError('');
    if (!file) return;

    // Check size limit: 2MB = 2 * 1024 * 1024 bytes
    if (file.size > 2 * 1024 * 1024) {
      setError('File exceeds maximum size limit of 2MB.');
      return;
    }

    // Allowed types: images or pdf
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setError('Invalid file format. Please upload PDF, JPG, or PNG.');
      return;
    }

    // Create object URL / mock base64 for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      handleNotify(effectiveId, {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: event.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 transition-all hover:border-csc-lightBlue">
      <div className="flex justify-between items-start mb-2">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-csc-navy" />
          <span>{effectiveName}</span>
          {isRequired && (
            <span className="text-red-500 font-bold">*</span>
          )}
        </label>
        {currentFile && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Uploaded
          </span>
        )}
      </div>

      {!currentFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer ${
            dragActive 
              ? 'border-csc-lightBlue bg-blue-50/80 scale-[1.01]' 
              : 'border-slate-300 hover:border-csc-lightBlue hover:bg-slate-100/60'
          }`}
        >
          <input
            type="file"
            id={`file-input-${effectiveId}`}
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-csc-navy">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-700">
              <span className="text-csc-lightBlue font-bold underline">Click to upload</span> or drag and drop file
            </p>
            <p className="text-[11px] text-slate-400">PDF, JPG or PNG (Max 2MB)</p>
          </div>
        </div>
      ) : (
        /* Preview Card */
        <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            {currentFile.type?.startsWith('image/') ? (
              <img 
                src={currentFile.url} 
                alt="Upload preview" 
                className="w-12 h-12 object-cover rounded-md border border-slate-200 shrink-0" 
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 border border-red-200">
                PDF
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate">{currentFile.name || 'Document'}</p>
              <p className="text-[11px] text-slate-400">{currentFile.size || ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {currentFile.url && (
              <a
                href={currentFile.url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-500 hover:text-csc-navy hover:bg-slate-100 rounded-md transition-colors"
                title="Preview Document"
              >
                <Eye className="w-4 h-4" />
              </a>
            )}
            <button
              type="button"
              onClick={() => handleNotify(effectiveId, null)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-xs text-red-600 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
