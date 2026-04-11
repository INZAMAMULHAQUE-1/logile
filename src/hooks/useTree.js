import { useState, useMemo, useCallback, useRef } from 'react';
import {
  buildTree,
  getFilterMatches,
  getAllFolderIds,
  getDescendantIds,
  findNodeById,
  isCircularMove,
} from '../components/Tree/treeUtils.js';

/**
 * Custom hook that manages all file explorer state and operations.
 *
 * @param {Array} initialData - Flat array of file/folder data
 * @returns {Object} Tree state and operations
 */
export function useTree(initialData) {
  // Flat data state — single source of truth
  const [flatData, setFlatData] = useState(() => [...initialData]);

  // Expanded folders (Set of IDs)
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  // Selected node ID
  const [selectedId, setSelectedId] = useState(null);

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Store expand state before search so we can restore it
  const preSearchExpandedRef = useRef(null);

  // Build hierarchical tree from flat data (memoized, O(n))
  const tree = useMemo(() => buildTree(flatData), [flatData]);

  // Compute filter matches when search is active
  const filterResult = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return getFilterMatches(tree, searchQuery.trim());
  }, [tree, searchQuery]);

  // Effective expanded IDs: during search, auto-expand ancestors of matched nodes
  const effectiveExpandedIds = useMemo(() => {
    if (filterResult) {
      // Merge user-expanded with ancestor paths of matched nodes
      const combined = new Set(filterResult.ancestorIds);
      // Also include matched folder IDs that have matching children
      for (const id of filterResult.matchedIds) {
        combined.add(id);
      }
      return combined;
    }
    return expandedIds;
  }, [filterResult, expandedIds]);

  // Toggle expand/collapse for a single folder
  const toggleExpand = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Expand all folders
  const expandAll = useCallback(() => {
    setExpandedIds(getAllFolderIds(tree));
  }, [tree]);

  // Collapse all folders
  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  // Update search query; save/restore expand state
  const updateSearch = useCallback(
    (query) => {
      if (query.trim() && !searchQuery.trim()) {
        // Entering search mode — save current expand state
        preSearchExpandedRef.current = new Set(expandedIds);
      } else if (!query.trim() && searchQuery.trim()) {
        // Leaving search mode — restore previous expand state
        if (preSearchExpandedRef.current) {
          setExpandedIds(preSearchExpandedRef.current);
          preSearchExpandedRef.current = null;
        }
      }
      setSearchQuery(query);
    },
    [searchQuery, expandedIds]
  );

  // Rename a node
  const renameNode = useCallback((id, newName) => {
    setFlatData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      )
    );
  }, []);

  // Delete a node (and all descendants if folder)
  const deleteNode = useCallback(
    (id) => {
      const node = findNodeById(tree, id);
      if (!node) return;

      const idsToRemove = getDescendantIds(node);

      setFlatData((prev) => prev.filter((item) => !idsToRemove.has(item.id)));

      // Clean up expanded state
      setExpandedIds((prev) => {
        const next = new Set(prev);
        for (const rid of idsToRemove) {
          next.delete(rid);
        }
        return next;
      });

      // Deselect if deleted
      setSelectedId((prev) => (idsToRemove.has(prev) ? null : prev));
    },
    [tree]
  );

  // Move a node to a new parent folder
  const moveNode = useCallback(
    (sourceId, targetId) => {
      // Validate move
      if (isCircularMove(tree, sourceId, targetId)) return false;

      const targetNode = findNodeById(tree, targetId);
      if (!targetNode || targetNode.type !== 'folder') return false;

      setFlatData((prev) =>
        prev.map((item) =>
          item.id === sourceId ? { ...item, parentId: targetId } : item
        )
      );

      // Auto-expand target folder
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.add(targetId);
        return next;
      });

      return true;
    },
    [tree]
  );

  return {
    tree,
    flatData,
    expandedIds: effectiveExpandedIds,
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
  };
}
