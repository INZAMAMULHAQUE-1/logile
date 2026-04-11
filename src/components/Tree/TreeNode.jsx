import { useState, useRef, useEffect, useCallback } from 'react';
import { formatSize } from './treeUtils.js';

/**
 * TreeNode component — renders a single node in the file explorer tree.
 * Supports expand/collapse, selection, inline rename, drag & drop, and context menu.
 */
export default function TreeNode({
  node,
  depth,
  expandedIds,
  selectedId,
  searchQuery,
  filterResult,
  onToggleExpand,
  onSelect,
  onRename,
  onDelete,
  onMove,
  onContextMenu,
  renamingId,
  setRenamingId,
}) {
  const [renameValue, setRenameValue] = useState(node.name);
  const inputRef = useRef(null);
  const isFolder = node.type === 'folder';
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isRenaming = renamingId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  // Check if this node should be visible during filtering
  const isVisible = !filterResult || filterResult.matchedIds.has(node.id) || filterResult.ancestorIds.has(node.id);

  // Focus input when entering rename mode
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  // Handle rename save
  const saveRename = useCallback(() => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== node.name) {
      onRename(node.id, trimmed);
    }
    setRenamingId(null);
  }, [renameValue, node.id, node.name, onRename, setRenamingId]);

  // Handle rename key events
  const handleRenameKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveRename();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setRenameValue(node.name);
        setRenamingId(null);
      }
    },
    [saveRename, node.name, setRenamingId]
  );

  // Start rename on double-click
  const handleDoubleClick = useCallback(
    (e) => {
      e.stopPropagation();
      setRenameValue(node.name);
      setRenamingId(node.id);
    },
    [node.id, node.name, setRenamingId]
  );

  // Context menu handler
  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onContextMenu(e, node);
    },
    [node, onContextMenu]
  );

  // Drag start
  const handleDragStart = useCallback(
    (e) => {
      e.dataTransfer.setData('text/plain', String(node.id));
      e.dataTransfer.effectAllowed = 'move';
    },
    [node.id]
  );

  // Drag over (allow drop on folders)
  const handleDragOver = useCallback(
    (e) => {
      if (isFolder) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }
    },
    [isFolder]
  );

  // Drop handler
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sourceId = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (!isNaN(sourceId) && sourceId !== node.id) {
        onMove(sourceId, node.id);
      }
    },
    [node.id, onMove]
  );

  // Highlight matching text in node name
  const renderName = () => {
    if (!searchQuery || !filterResult || !filterResult.matchedIds.has(node.id)) {
      return <span className="tree-node-name">{node.name}</span>;
    }

    const lowerName = node.name.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    const index = lowerName.indexOf(lowerQuery);

    if (index === -1) {
      return <span className="tree-node-name">{node.name}</span>;
    }

    return (
      <span className="tree-node-name">
        {node.name.slice(0, index)}
        <mark>{node.name.slice(index, index + searchQuery.length)}</mark>
        {node.name.slice(index + searchQuery.length)}
      </span>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="tree-node-wrapper">
      <div
        className={`tree-node ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          onSelect(node.id);
          if (isFolder) onToggleExpand(node.id);
        }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        draggable={!isRenaming}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="treeitem"
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-selected={isSelected}
      >
        {/* Expand/collapse arrow for folders */}
        <span
          className="tree-node-arrow"
          onClick={(e) => {
            e.stopPropagation();
            if (isFolder) onToggleExpand(node.id);
          }}
        >
          {isFolder ? (isExpanded ? '▼' : '▶') : ''}
        </span>

        {/* File/folder icon */}
        <span className="tree-node-icon">
          {isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
        </span>

        {/* Node name or rename input */}
        {isRenaming ? (
          <input
            ref={inputRef}
            className="tree-node-rename-input"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={handleRenameKeyDown}
            onBlur={saveRename}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          renderName()
        )}

        {/* File size badge (files only) */}
        {!isFolder && node.size != null && (
          <span className="tree-node-size">{formatSize(node.size)}</span>
        )}

        {/* Orphan badge */}
        {node.isOrphan && <span className="tree-node-orphan">orphan</span>}
      </div>

      {/* Render children if folder is expanded */}
      {isFolder && isExpanded && hasChildren && (
        <div className="tree-node-children" role="group">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              searchQuery={searchQuery}
              filterResult={filterResult}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onMove={onMove}
              onContextMenu={onContextMenu}
              renamingId={renamingId}
              setRenamingId={setRenamingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
