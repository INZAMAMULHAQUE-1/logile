import { useState, useCallback, useEffect, useRef, memo } from 'react';
import TreeNode from './TreeNode.jsx';

/**
 * TreeView component — renders the full file explorer tree with context menu support.
 */
const TreeView = memo(function TreeView({
  tree,
  expandedIds,
  selectedId,
  searchQuery,
  filterResult,
  onToggleExpand,
  onSelect,
  onRename,
  onDelete,
  onMove,
}) {
  const [renamingId, setRenamingId] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);

  // Handle right-click context menu
  const handleContextMenu = useCallback((e, node) => {
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node,
    });
  }, []);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [contextMenu]);

  // Close context menu on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setContextMenu(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Context menu action handlers
  const handleRenameAction = useCallback(() => {
    if (contextMenu) {
      setRenamingId(contextMenu.node.id);
      setContextMenu(null);
    }
  }, [contextMenu]);

  const handleDeleteAction = useCallback(() => {
    if (contextMenu) {
      onDelete(contextMenu.node.id);
      setContextMenu(null);
    }
  }, [contextMenu, onDelete]);

  if (!tree || tree.length === 0) {
    return (
      <div className="tree-empty">
        <span>No files to display</span>
      </div>
    );
  }

  return (
    <div className="tree-view" role="tree">
      {tree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          expandedIds={expandedIds}
          selectedId={selectedId}
          searchQuery={searchQuery}
          filterResult={filterResult}
          onToggleExpand={onToggleExpand}
          onSelect={onSelect}
          onRename={onRename}
          onDelete={onDelete}
          onMove={onMove}
          onContextMenu={handleContextMenu}
          renamingId={renamingId}
          setRenamingId={setRenamingId}
        />
      ))}

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button className="context-menu-item" onClick={handleRenameAction}>
            ✏️ Rename
          </button>
          <button className="context-menu-item" onClick={handleDeleteAction}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
});

export default TreeView;
