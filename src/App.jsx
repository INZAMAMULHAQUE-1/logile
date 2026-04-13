import { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from './components/SearchBar.jsx';
import Toolbar from './components/Toolbar.jsx';
import TreeView from './components/Tree/TreeView.jsx';
import FileTypeFilter from './components/FileTypeFilter.jsx';
import EditorTabs from './components/EditorTabs.jsx';
import { useTree } from './hooks/useTree.js';
import './styles/tree.css';

/**
 * App component — root of the File Explorer application.
 * Renders a VS Code–style sidebar with search, toolbar, and tree view.
 */
export default function App() {
  const [uploadedData, setUploadedData] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const fileInputRef = useRef(null);

  // Update hook when data changes
  const {
    tree,
    flatData,
    expandedIds,
    selectedId,
    searchQuery,
    filterResult,
    setSelectedId,
    toggleExpand,
    expandAll,
    collapseAll,
    updateSearch,
    renameNode,
    deleteNode,
    moveNode,
    getBreadcrumbPath,
    getFilteredTree,
  } = useTree(uploadedData);

  // Get filtered tree based on file type
  const filteredTree = getFilteredTree(fileTypeFilter);

  // Handle opening a file in editor
  const handleOpenFile = useCallback((node) => {
    if (!node) return;
    
    // Only open files, not folders
    if (node.type === 'folder') return;
    
    // Check if file already open
    const alreadyOpen = openFiles.find(f => f.id === node.id);
    
    if (!alreadyOpen) {
      // Add new file to open files
      setOpenFiles(prev => [...prev, node]);
    }
    
    // Set as active file
    setActiveFileId(node.id);
  }, [openFiles]);

  // Handle closing a file
  const handleCloseFile = useCallback((fileId) => {
    setOpenFiles(prev => prev.filter(f => f.id !== fileId));
    
    // If closed file was active, switch to another
    if (activeFileId === fileId) {
      const remaining = openFiles.filter(f => f.id !== fileId);
      setActiveFileId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  }, [openFiles, activeFileId]);

  // Handle breadcrumb navigation in a specific file
  const handleFileNavigate = useCallback((fileId, nodeId) => {
    if (!nodeId || !uploadedData) return;
    
    const navigatedNode = uploadedData.find(n => n.id === nodeId);
    if (!navigatedNode) return;
    
    // Update the file in openFiles array
    setOpenFiles(prev => 
      prev.map(f => f.id === fileId ? navigatedNode : f)
    );
  }, [uploadedData]);

  // Handle file upload
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      alert('Please select a valid JSON file (.json)');
      return;
    }

    try {
      const text = await file.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Invalid JSON format. Please check your file syntax.');
      }

      if (!Array.isArray(data)) {
        throw new Error('JSON must be an array of file/folder objects.');
      }

      if (data.length === 0) {
        throw new Error('JSON array cannot be empty.');
      }

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

      console.log('Data loaded:', data.length, 'items');
      setUploadedData(data);
      
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddFile = () => {
    if (!uploadedData) {
      alert('Please upload a JSON file first');
      return;
    }
    alert('Add File feature coming soon!');
  };

  const handleAddFolder = () => {
    if (!uploadedData) {
      alert('Please upload a JSON file first');
      return;
    }
    alert('Add Folder feature coming soon!');
  };

  const handleDataLoaded = (data) => {
    console.log('Data loaded:', data.length, 'items');
    setUploadedData(data);
  };

  const handleUploadNewFile = () => {
    setUploadedData(null);
    setOpenFiles([]);
    setActiveFileId(null);
  };

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-title">📁 Logile</div>
        <div className="header-actions">
          <button className="header-btn add-folder-btn" onClick={handleAddFolder} title="Add Folder">
            📁+ Folder
          </button>
          <button className="header-btn add-file-btn" onClick={handleAddFile} title="Add File">
            📄+ File
          </button>
          <button className="header-btn upload-btn-top" onClick={handleUploadClick} title="Upload JSON File">
            ⬆️ Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <div className="app-main">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-header-content">
              <span>Explorer</span>
              {uploadedData && (
                <button
                  className="upload-btn"
                  onClick={handleUploadNewFile}
                  title="Upload new JSON file"
                >
                  🔄
                </button>
              )}
            </div>
          </div>
          {uploadedData ? (
            <>
              <SearchBar value={searchQuery} onChange={updateSearch} />
              <FileTypeFilter selectedFilter={fileTypeFilter} onFilterChange={setFileTypeFilter} />
              <Toolbar onExpandAll={expandAll} onCollapseAll={collapseAll} />
              <div className="sidebar-content">
                <TreeView
                  tree={filteredTree}
                  expandedIds={expandedIds}
                  selectedId={selectedId}
                  searchQuery={searchQuery}
                  filterResult={filterResult}
                  onToggleExpand={toggleExpand}
                  onSelect={(id) => {
                    setSelectedId(id);
                    const node = uploadedData?.find(n => n.id === id);
                    if (node) handleOpenFile(node);
                  }}
                  onRename={renameNode}
                  onDelete={deleteNode}
                  onMove={moveNode}
                />
              </div>
            </>
          ) : (
            <div className="sidebar-empty">
              <p>📂 No file loaded</p>
              <p>Click "Upload" button at top right to get started</p>
            </div>
          )}
        </aside>
        <main className="main-content">
          {uploadedData ? (
            <EditorTabs 
              openFiles={openFiles}
              activeFileId={activeFileId}
              flatData={uploadedData}
              getBreadcrumbPath={getBreadcrumbPath}
              onSelectFile={setActiveFileId}
              onCloseFile={handleCloseFile}
              onNavigate={handleFileNavigate}
            />
          ) : (
            <div className="main-empty">
              <div className="empty-content">
                <div className="empty-icon">📁</div>
                <h2>Welcome to Logile</h2>
                <p>Upload a JSON file to start exploring your file structure</p>
                <button className="empty-upload-btn" onClick={handleUploadClick}>
                  📤 Upload JSON File
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
