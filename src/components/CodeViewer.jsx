import { useMemo } from 'react';
import Breadcrumb from './Breadcrumb.jsx';

/**
 * CodeViewer component — displays file content with syntax highlighting
 */
export default function CodeViewer({ node, flatData, breadcrumbPath, onNavigate }) {
  // Get the content of the selected file
  const fileContent = useMemo(() => {
    if (!node || node.type === 'folder' || !flatData) {
      return null;
    }

    // Find the node in flatData to get its content
    const fileNode = flatData.find((item) => item.id === node.id);
    return fileNode?.content || '';
  }, [node, flatData]);

  if (!node) {
    return (
      <div className="code-viewer">
        <div className="code-viewer-empty">
          <p>Select a file to view its content</p>
          <span>Select a file from the file tree on the left</span>
        </div>
      </div>
    );
  }

  if (node.type === 'folder') {
    return (
      <div className="code-viewer">
        <div className="code-viewer-header">
          <div className="file-icon">📁</div>
          <span className="file-name">{node.name}</span>
        </div>
        <div className="code-viewer-empty">
          <p>📁 {node.name}</p>
          <span>Folder selected. Select a file to view content.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="code-viewer">
      <div className="code-viewer-header">
        <div className="file-icon">📄</div>
        <span className="file-name">{node.name}</span>
      </div>
      <Breadcrumb path={breadcrumbPath} onNavigate={onNavigate} />
      <div className="code-viewer-content">
        <pre>
          <code>{fileContent}</code>
        </pre>
      </div>
    </div>
  );
}
