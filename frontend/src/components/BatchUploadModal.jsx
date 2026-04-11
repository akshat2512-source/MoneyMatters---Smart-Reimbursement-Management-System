import React, { useState, useRef, useCallback } from 'react';
import { batchUploadReceipts } from '../api';
import {
  X, Upload, Loader2, CheckCircle2, AlertTriangle, ImageIcon,
  DollarSign, Calendar, Tag, AlignLeft, PackageOpen, Trash2, Layers
} from 'lucide-react';

const CATEGORIES = [
  'Travel', 'Meals', 'Accommodation', 'Office Supplies',
  'Software', 'Training', 'Healthcare', 'Entertainment', 'Other'
];

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'INR', symbol: '₹' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'AED', symbol: 'د.إ' },
  { code: 'SGD', symbol: 'S$' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'AUD', symbol: 'A$' },
];

const MAX_FILES = 6;
const MAX_SIZE_MB = 5;

/**
 * BatchUploadModal
 * Allows employees to upload up to 6 receipt images in one batch submission.
 * Shows per-receipt preview cards with OCR status and editable fields.
 */
const BatchUploadModal = ({ open, onClose, onSuccess }) => {
  const [receipts, setReceipts] = useState([]);  // Array of receipt objects
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // ── File Intake ──────────────────────────────────────────────
  const processFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    
    // Validate total (existing + new)
    if (receipts.length + fileArray.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} receipts per batch. You already have ${receipts.length}.`);
      return;
    }

    const newReceipts = [];
    for (const file of fileArray) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(`"${file.name}" is not an image. Only image files are accepted.`);
        continue;
      }
      // Validate file size
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`"${file.name}" exceeds ${MAX_SIZE_MB}MB limit.`);
        continue;
      }

      newReceipts.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        ocrStatus: 'idle',  // idle | loading | done | failed
        // Editable fields (will be pre-filled by OCR after upload)
        fields: {
          title: file.name.replace(/\.[^.]+$/, ''),  // filename without ext as default title
          amount: '',
          currency: 'USD',
          date: new Date().toISOString().split('T')[0],
          description: '',
          category: 'Other',
        }
      });
    }

    if (newReceipts.length > 0) {
      setReceipts(prev => [...prev, ...newReceipts]);
      setError('');
    }
  }, [receipts.length]);

  const handleFileInput = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removeReceipt = (id) => {
    setReceipts(prev => {
      const updated = prev.filter(r => r.id !== id);
      // Revoke object URL to free memory
      const removed = prev.find(r => r.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };

  const updateField = (id, field, value) => {
    setReceipts(prev =>
      prev.map(r => r.id === id ? { ...r, fields: { ...r.fields, [field]: value } } : r)
    );
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (receipts.length === 0) {
      setError('Please add at least one receipt.');
      return;
    }

    setUploading(true);
    setError('');

    // Mark all as loading (OCR will happen server-side)
    setReceipts(prev => prev.map(r => ({ ...r, ocrStatus: 'loading' })));

    try {
      const formData = new FormData();
      receipts.forEach(r => formData.append('files', r.file));

      const res = await batchUploadReceipts(formData);

      if (res.data.success) {
        // Update OCR statuses from response
        const serverResults = res.data.data;
        setReceipts(prev =>
          prev.map((r, i) => ({
            ...r,
            ocrStatus: serverResults[i]?.success
              ? (serverResults[i]?.ocr?.failed ? 'failed' : 'done')
              : 'failed',
            // Pre-fill fields from OCR if available
            fields: {
              ...r.fields,
              title: serverResults[i]?.ocr?.title || r.fields.title,
              amount: serverResults[i]?.ocr?.amount || r.fields.amount,
              date: serverResults[i]?.ocr?.date || r.fields.date,
            }
          }))
        );

        // Brief moment to show final statuses, then close
        setTimeout(() => {
          onSuccess && onSuccess(res.data);
          handleClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Batch upload failed. Please try again.');
      setReceipts(prev => prev.map(r => ({ ...r, ocrStatus: 'idle' })));
    } finally {
      setUploading(false);
    }
  };

  // ── Cleanup ───────────────────────────────────────────────────
  const handleClose = () => {
    receipts.forEach(r => URL.revokeObjectURL(r.preview));
    setReceipts([]);
    setError('');
    setUploading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={!uploading ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Batch Receipt Upload</h2>
              <p className="text-[11px] text-white/70 mt-0.5">
                Upload up to {MAX_FILES} receipts — OCR auto-extracts amounts & dates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold bg-white/20 px-3 py-1 rounded-full">
              {receipts.length} / {MAX_FILES}
            </span>
            <button
              onClick={!uploading ? handleClose : undefined}
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Drop Zone — hide when max reached */}
          {receipts.length < MAX_FILES && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all
                ${dragOver
                  ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
                  : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700">
                  {dragOver ? 'Drop your receipts here' : 'Drag & drop or click to select'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Images only (JPEG, PNG, WebP) • Max {MAX_SIZE_MB}MB per file • {MAX_FILES - receipts.length} slot{receipts.length === MAX_FILES - 1 ? '' : 's'} remaining
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              <AlertTriangle size={16} className="flex-shrink-0" />
              <span>{error}</span>
              <button onClick={() => setError('')} className="ml-auto"><X size={14} /></button>
            </div>
          )}

          {/* Receipt Preview Cards */}
          {receipts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {receipts.map((receipt, index) => (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  index={index}
                  uploading={uploading}
                  onRemove={removeReceipt}
                  onUpdateField={updateField}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {receipts.length === 0 && !error && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mb-3">
                <PackageOpen size={32} />
              </div>
              <p className="text-sm font-bold text-slate-500">No receipts added yet</p>
              <p className="text-xs text-slate-400 mt-1">Use the drop zone above to start</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="text-[11px] text-slate-400">
            {receipts.length > 0
              ? `${receipts.length} receipt${receipts.length > 1 ? 's' : ''} ready — OCR runs automatically on submission`
              : 'Add receipts above to continue'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={!uploading ? handleClose : undefined}
              disabled={uploading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={receipts.length === 0 || uploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing {receipts.length} receipts…
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Submit {receipts.length > 0 ? `${receipts.length} ` : ''}Receipts
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Receipt Card ─────────────────────────────────────────────────────────────
const ReceiptCard = ({ receipt, index, uploading, onRemove, onUpdateField }) => {
  const { id, preview, ocrStatus, fields } = receipt;

  const OcrBadge = () => {
    if (ocrStatus === 'loading') return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
        <Loader2 size={10} className="animate-spin" /> OCR Scanning…
      </span>
    );
    if (ocrStatus === 'done') return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
        <CheckCircle2 size={10} /> OCR Done
      </span>
    );
    if (ocrStatus === 'failed') return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
        <AlertTriangle size={10} /> Manual Entry
      </span>
    );
    return (
      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
        Pending OCR
      </span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
            {index + 1}
          </div>
          <OcrBadge />
        </div>
        {!uploading && (
          <button
            onClick={() => onRemove(id)}
            className="w-7 h-7 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <div className="flex gap-0">
        {/* Image Preview */}
        <div className="w-28 flex-shrink-0 bg-slate-100 flex items-center justify-center relative overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt={`Receipt ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ minHeight: '160px' }}
            />
          ) : (
            <div className="flex flex-col items-center text-slate-300 p-4">
              <ImageIcon size={24} />
              <span className="text-[9px] mt-1">No preview</span>
            </div>
          )}
          {/* Loading overlay */}
          {ocrStatus === 'loading' && (
            <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Editable Fields */}
        <div className="flex-1 p-3 space-y-2 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-1.5">
            <Tag size={11} className="text-slate-300 flex-shrink-0" />
            <input
              type="text"
              value={fields.title}
              onChange={(e) => onUpdateField(id, 'title', e.target.value)}
              placeholder="Expense title"
              disabled={uploading}
              className="flex-1 text-xs font-bold text-slate-700 bg-transparent border-b border-slate-100 focus:border-indigo-400 focus:outline-none py-0.5 placeholder:text-slate-300 disabled:opacity-60 min-w-0"
            />
          </div>

          {/* Amount + Currency */}
          <div className="flex items-center gap-1.5">
            <DollarSign size={11} className="text-slate-300 flex-shrink-0" />
            <select
              value={fields.currency}
              onChange={(e) => onUpdateField(id, 'currency', e.target.value)}
              disabled={uploading}
              className="text-[10px] font-bold text-slate-600 bg-transparent border-none focus:outline-none cursor-pointer disabled:opacity-60"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
            <input
              type="number"
              value={fields.amount}
              onChange={(e) => onUpdateField(id, 'amount', e.target.value)}
              placeholder="0.00"
              disabled={uploading}
              className="flex-1 text-xs font-bold text-slate-700 bg-transparent border-b border-slate-100 focus:border-indigo-400 focus:outline-none py-0.5 placeholder:text-slate-300 disabled:opacity-60 min-w-0"
            />
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5">
            <Calendar size={11} className="text-slate-300 flex-shrink-0" />
            <input
              type="date"
              value={fields.date}
              onChange={(e) => onUpdateField(id, 'date', e.target.value)}
              disabled={uploading}
              className="flex-1 text-[10px] text-slate-600 bg-transparent border-b border-slate-100 focus:border-indigo-400 focus:outline-none py-0.5 disabled:opacity-60 min-w-0"
            />
          </div>

          {/* Category */}
          <div className="flex items-center gap-1.5">
            <AlignLeft size={11} className="text-slate-300 flex-shrink-0" />
            <select
              value={fields.category}
              onChange={(e) => onUpdateField(id, 'category', e.target.value)}
              disabled={uploading}
              className="flex-1 text-[10px] text-slate-600 bg-transparent border-none focus:outline-none py-0.5 disabled:opacity-60 cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div className="flex items-start gap-1.5">
            <AlignLeft size={11} className="text-slate-300 flex-shrink-0 mt-0.5" />
            <textarea
              value={fields.description}
              onChange={(e) => onUpdateField(id, 'description', e.target.value)}
              placeholder="Notes (optional)"
              disabled={uploading}
              rows={2}
              className="flex-1 text-[10px] text-slate-600 bg-transparent border-b border-slate-100 focus:border-indigo-400 focus:outline-none py-0.5 placeholder:text-slate-300 disabled:opacity-60 resize-none min-w-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchUploadModal;
