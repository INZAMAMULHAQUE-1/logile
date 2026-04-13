import React from 'react';
import Breadcrumb from './Breadcrumb.jsx';

/**
 * EditorPanel component — displays a single file with breadcrumb
 */
function EditorPanel({ node, flatData, breadcrumbPath, onNavigate, onClose, isActive }) {
  if (!node) {
    return null;
  }

  const fileContent = flatData?.find((item) => item.id === node.id)?.content || '';

  return (
    <div className={`editor-panel ${isActive ? 'active' : ''}`}>
      <div className="editor-panel-header">
        <div className="editor-file-info">
          <span className="editor-file-icon">{node.type === 'folder' ? '📁' : '📄'}</span>
          <span className="editor-file-name">{node.name}</span>
        </div>
        <button
          className="editor-close-btn"
          onClick={onClose}
          title="Close file"
        >
          ✕
        </button>
      </div>
      <Breadcrumb path={breadcrumbPath} onNavigate={onNavigate} />
      <div className="editor-content">
        {node.type === 'folder' ? (
          <div className="code-viewer-empty">
            <p>📁 {node.name}</p>
            <span>Folder selected. Select a file to view content.</span>
          </div>
        ) : (
          <pre>
            <code>{fileContent}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

/**
 * EditorTabs component — manages multiple open files in side-by-side view
 */
export default function EditorTabs({ 
  openFiles, 
  activeFileId, 
  flatData, 
  getBreadcrumbPath,
  onSelectFile,
  onCloseFile,
  onNavigate 
}) {
  if (openFiles.length === 0) {
    return (
      <div className="editors-container empty">
        <div className="code-viewer-empty">
          <p>Select a file to view</p>
          <span>Open files appear here in tabs</span>
        </div>
      </div>
    );
  }

  return (
    <div className="editors-container">
      <div className="editor-tabs-bar">
        {openFiles.map((file) => (
          <button
            key={file.id}
            className={`editor-tab ${activeFileId === file.id ? 'active' : ''}`}
            onClick={() => onSelectFile(file.id)}
            title={file.name}
          >
            <span className="editor-tab-icon">{file.type === 'folder' ? '📁' : '📄'}</span>
            <span className="editor-tab-name">{file.name}</span>
            <button
              className="editor-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onCloseFile(file.id);
              }}
              title="Close"
            >
              ✕
            </button>
          </button>
        ))}
      </div>

      <div className="editors-wrapper">
        {openFiles.map((file) => (
          <EditorPanel
            key={file.id}
            node={file}
            flatData={flatData}
            breadcrumbPath={getBreadcrumbPath(file.id)}
            onNavigate={(nodeId) => onNavigate(file.id, nodeId)}
            onClose={() => onCloseFile(file.id)}
            isActive={activeFileId === file.id}
          />
        ))}
      </div>
    </div>
  );
}
