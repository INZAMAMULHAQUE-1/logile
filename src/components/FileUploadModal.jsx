import { useState, useRef } from 'react';

/**
 * FileUploadModal component — displays a modal for uploading JSON files
 */
export default function FileUploadModal({ onDataLoaded, isOpen }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const loadJSONData = async (file) => {
    setLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      // Read the file
      const text = await file.text();

      // Parse JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Invalid JSON format. Please check your file syntax.');
      }

      // Validate structure
      if (!Array.isArray(data)) {
        throw new Error('JSON must be an array of file/folder objects.');
      }

      if (data.length === 0) {
        throw new Error('JSON array cannot be empty.');
      }

      // Validate structure - check first few items for proper structure
      for (let i = 0; i < Math.min(data.length, 3); i++) {
        const item = data[i];
        
        // Check required fields
        if (typeof item.id === 'undefined') {
          throw new Error(`Object at index ${i}: Missing required field "id"`);
        }
        if (typeof item.name !== 'string' || !item.name.trim()) {
          throw new Error(`Object at index ${i}: "name" must be a non-empty string`);
        }
        if (typeof item.type !== 'string' || !item.type.trim()) {
          throw new Error(`Object at index ${i}: "type" must be a non-empty string`);
        }
        
        // Validate types
        if (typeof item.id !== 'number' && typeof item.id !== 'string') {
          throw new Error(`Object at index ${i}: "id" must be a number or string`);
        }
      }

      // All validation passed
      setLoading(false);
      onDataLoaded(data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError('Please select a valid JSON file (.json)');
      return;
    }

    await loadJSONData(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (!file.name.endsWith('.json')) {
        setError('Please drop a valid JSON file (.json)');
        return;
      }

      await loadJSONData(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal-content">
        <div className="upload-modal-header">
          <h2>📁 File Explorer</h2>
          <p>Upload a JSON file to explore your file structure</p>
        </div>

        <div className="upload-modal-body">
          <div
            className={`upload-area ${dragActive ? 'active' : ''}`}
            onClick={handleClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-icon">{loading ? '⏳' : '📤'}</div>
            <h3>{fileName ? `Selected: ${fileName}` : 'Choose a JSON File'}</h3>
            <p>{loading ? 'Processing file...' : 'Click to select or drag and drop'}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={loading}
            />
          </div>

          {error && <div className="upload-error">❌ {error}</div>}

          {loading && <div className="upload-loading">⏳ Loading and validating file...</div>}

          <div className="upload-info">
            <h4>Expected JSON Format</h4>
            <pre>{`[
  {
    "id": 1,
    "name": "src",
    "type": "folder",
    "parentId": null
  },
  {
    "id": 2,
    "name": "file.js",
    "type": "file",
    "parentId": 1,
    "size": 1024,
    "content": "// optional file content"
  }
]`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
