import React, { useRef } from 'react';

/**
 * HomePage component — displays welcome message and upload button
 */
export default function HomePage({ onUpload }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('Please select a valid JSON file (.json)');
      return;
    }

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

      // Validate structure - check first few items
      for (let i = 0; i < Math.min(data.length, 3); i++) {
        const item = data[i];
        
        if (typeof item.id === 'undefined') {
          throw new Error(`Object at index ${i}: Missing required field "id"`);
        }
        if (typeof item.name !== 'string' || !item.name.trim()) {
          throw new Error(`Object at index ${i}: "name" must be a non-empty string`);
        }
        if (typeof item.type !== 'string' || !item.type.trim()) {
          throw new Error(`Object at index ${i}: "type" must be a non-empty string`);
        }
        
        if (typeof item.id !== 'number' && typeof item.id !== 'string') {
          throw new Error(`Object at index ${i}: "id" must be a number or string`);
        }
      }

      // All validation passed
      onUpload(data);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <div className="home-logo">📁</div>
          <h1>Logile - File Explorer</h1>
          <p>Explore and manage your file structures with ease</p>
        </div>

        <div className="home-content">
          <div className="home-section">
            <h2>Get Started</h2>
            <p>Upload a JSON file to start exploring your file structure</p>
          </div>

          <button className="home-upload-btn" onClick={handleClick}>
            <span className="upload-icon">📤</span>
            <span className="upload-text">Upload JSON File</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div className="home-info">
            <h3>Expected JSON Format</h3>
            <p>Your JSON file should contain an array of file/folder objects:</p>
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

          <div className="home-features">
            <h3>Features</h3>
            <ul>
              <li>✨ Multi-file editor with tab support</li>
              <li>🔍 Search and filter by file type</li>
              <li>📂 Navigate through folder structures</li>
              <li>🎯 Breadcrumb navigation for each file</li>
              <li>🌈 Beautiful VS Code-inspired UI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
