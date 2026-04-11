/**
 * Tree utility functions for building and manipulating the file explorer tree.
 */

/**
 * Build a hierarchical tree from a flat array in O(n) time.
 * Each node gets a `children` array and an `isOrphan` flag.
 *
 * @param {Array} flatData - Array of { id, name, parentId, type, size? }
 * @returns {Array} Array of root-level tree nodes
 */
export function buildTree(flatData) {
  if (!flatData || flatData.length === 0) return [];

  const map = new Map(); // id → node (with children array)
  const roots = [];

  // First pass: create node entries with children arrays
  for (const item of flatData) {
    map.set(item.id, { ...item, children: [], isOrphan: false });
  }

  // Second pass: link children to parents
  for (const item of flatData) {
    const node = map.get(item.id);

    if (item.parentId == null) {
      // Root node
      roots.push(node);
    } else if (map.has(item.parentId)) {
      // Valid parent exists
      map.get(item.parentId).children.push(node);
    } else {
      // Parent not found → orphan
      node.isOrphan = true;
      roots.push(node);
    }
  }

  // Sort children: folders first, then alphabetically
  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
    for (const node of nodes) {
      if (node.children.length > 0) {
        sortNodes(node.children);
      }
    }
  };

  sortNodes(roots);
  return roots;
}

/**
 * Flatten the tree back into a flat array (for state updates).
 *
 * @param {Array} tree - Hierarchical tree nodes
 * @returns {Array} Flat array of node data (without children/isOrphan)
 */
export function flattenTree(tree) {
  const result = [];

  const traverse = (nodes) => {
    for (const node of nodes) {
      result.push({
        id: node.id,
        name: node.name,
        parentId: node.parentId,
        type: node.type,
        ...(node.size != null ? { size: node.size } : {}),
      });
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };

  traverse(tree);
  return result;
}

/**
 * Collect all descendant IDs of a node (inclusive).
 *
 * @param {Object} node - Tree node
 * @returns {Set} Set of descendant IDs
 */
export function getDescendantIds(node) {
  const ids = new Set();
  const stack = [node];

  while (stack.length > 0) {
    const current = stack.pop();
    ids.add(current.id);
    if (current.children) {
      for (const child of current.children) {
        stack.push(child);
      }
    }
  }

  return ids;
}

/**
 * Find a node in the tree by ID.
 *
 * @param {Array} tree - Hierarchical tree nodes
 * @param {number} id - Node ID to find
 * @returns {Object|null} The node or null
 */
export function findNodeById(tree, id) {
  const stack = [...tree];

  while (stack.length > 0) {
    const node = stack.pop();
    if (node.id === id) return node;
    if (node.children) {
      stack.push(...node.children);
    }
  }

  return null;
}

/**
 * Get all ancestor IDs for nodes matching a search query.
 * Used to auto-expand paths to matching nodes during filtering.
 *
 * @param {Array} tree - Hierarchical tree nodes
 * @param {string} query - Search query (case-insensitive substring)
 * @returns {{ matchedIds: Set, ancestorIds: Set }}
 */
export function getFilterMatches(tree, query) {
  const lowerQuery = query.toLowerCase();
  const matchedIds = new Set();
  const ancestorIds = new Set();

  const traverse = (nodes, ancestors) => {
    for (const node of nodes) {
      const currentAncestors = [...ancestors, node.id];

      if (node.name.toLowerCase().includes(lowerQuery)) {
        matchedIds.add(node.id);
        // Mark all ancestors for expansion
        for (const aid of ancestors) {
          ancestorIds.add(aid);
        }
      }

      if (node.children && node.children.length > 0) {
        traverse(node.children, currentAncestors);
      }
    }
  };

  traverse(tree, []);
  return { matchedIds, ancestorIds };
}

/**
 * Check if moving sourceId into targetId would create a circular reference.
 *
 * @param {Array} tree - Hierarchical tree nodes
 * @param {number} sourceId - ID of the node being moved
 * @param {number} targetId - ID of the target folder
 * @returns {boolean} True if the move is invalid (circular)
 */
export function isCircularMove(tree, sourceId, targetId) {
  if (sourceId === targetId) return true;

  const sourceNode = findNodeById(tree, sourceId);
  if (!sourceNode) return true;

  const descendants = getDescendantIds(sourceNode);
  return descendants.has(targetId);
}

/**
 * Format file size into a human-readable string.
 *
 * @param {number} bytes
 * @returns {string}
 */
export function formatSize(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Collect all folder IDs in the tree (for Expand All).
 *
 * @param {Array} tree - Hierarchical tree nodes
 * @returns {Set} Set of all folder IDs
 */
export function getAllFolderIds(tree) {
  const ids = new Set();
  const stack = [...tree];

  while (stack.length > 0) {
    const node = stack.pop();
    if (node.type === 'folder') {
      ids.add(node.id);
    }
    if (node.children) {
      stack.push(...node.children);
    }
  }

  return ids;
}
