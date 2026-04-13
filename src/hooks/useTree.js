import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
  const [flatData, setFlatData] = useState(() => [...(initialData || [])]);

  // Expanded folders (Set of IDs)
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  // Selected node ID
  const [selectedId, setSelectedId] = useState(null);

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Store expand state before search so we can restore it
  const preSearchExpandedRef = useRef(null);

  // Update flatData when initialData changes
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      // Update flatData and reset state
      setFlatData([...initialData]);
      setExpandedIds(new Set());
      setSelectedId(null);
      setSearchQuery('');
    }
  }, [initialData?.length]); // Only depend on data length to avoid re-renders

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

  // Expand all folders with aggressive chunking for large trees
  const expandAll = useCallback(() => {
    const allFolderIds = getAllFolderIds(tree);
    
    if (allFolderIds.size === 0) return;
    
    // For small trees, expand immediately
    if (allFolderIds.size <= 30) {
      setExpandedIds(allFolderIds);
      return;
    }
    
    // For large trees, chunk heavily and use longer delays
    const folderArray = Array.from(allFolderIds);
    const chunkSize = 30; // Process 30 folders at a time
    let currentIndex = 0;
    
    const processNextChunk = () => {
      if (currentIndex >= folderArray.length) {
        // Final update with all IDs
        setExpandedIds(allFolderIds);
        return;
      }
      
      // Process chunk
      const end = Math.min(currentIndex + chunkSize, folderArray.length);
      const chunk = folderArray.slice(currentIndex, end);
      
      setExpandedIds((prev) => {
        const next = new Set(prev);
        chunk.forEach(id => next.add(id));
        return next;
      });
      
      currentIndex = end;
      
      // Use longer delay between chunks for very large datasets
      const delay = allFolderIds.size > 500 ? 50 : 30;
      setTimeout(processNextChunk, delay);
    };
    
    processNextChunk();
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

  // Get breadcrumb path from root to a node
  const getBreadcrumbPath = useCallback(
    (nodeId) => {
      if (!nodeId) return [];

      const path = [];
      let currentId = nodeId;

      while (currentId) {
        const node = flatData.find((item) => item.id === currentId);
        if (!node) break;

        path.unshift(node);
        currentId = node.parentId;
      }

      return path;
    },
    [flatData]
  );

  // Get file extension
  const getFileExtension = useCallback((filename) => {
    if (!filename) return '';
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.substring(lastDot).toLowerCase() : '';
  }, []);

  // Check if file matches filter type
  const isFileOfType = useCallback((filename, filterType) => {
    if (filterType === 'all') return true;

    const ext = getFileExtension(filename);
    
    const typePatterns = {
      images: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'],
      documents: ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx', '.csv'],
      code: ['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.json', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.rb', '.php'],
      video: ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv'],
      audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'],
      archives: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
    };

    const patterns = typePatterns[filterType] || [];
    return patterns.includes(ext);
  }, [getFileExtension]);

  // Filter tree to show only specific file types (but keep folders for navigation)
  const getFilteredTree = useCallback((fileTypeFilter) => {
    if (fileTypeFilter === 'all') return tree;

    const filterNodeVisibility = (node) => {
      if (node.type === 'folder') {
        // Always include folders, they might contain matching files
        return true;
      }
      // Show files that match the filter
      return isFileOfType(node.name, fileTypeFilter);
    };

    const filterNodes = (nodes) => {
      return nodes
        .filter(filterNodeVisibility)
        .map((node) => ({
          ...node,
          children: node.children ? filterNodes(node.children) : [],
        }))
        .filter((node) => node.type === 'folder' || node.children.length > 0 || isFileOfType(node.name, fileTypeFilter));
    };

    return filterNodes(tree);
  }, [tree, isFileOfType]);

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
    getBreadcrumbPath,
    getFilteredTree,
    isFileOfType,
  };
}
