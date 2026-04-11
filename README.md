# File Explorer — VS Code Style

A scalable, high-performance file explorer built with React and Vite. Features a VS Code–style sidebar UI with tree navigation, search filtering, inline rename, delete, and drag-and-drop move operations.

## Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- **Tree Rendering** — Flat-to-tree conversion in O(n) with folder/file sorting
- **VS Code Dark Theme** — Dark sidebar with hover/selected highlights, scrollable
- **Expand / Collapse** — Per-folder toggle, Expand All / Collapse All toolbar buttons
- **Search Filtering** — Case-insensitive substring search with ancestor auto-expansion, text highlighting with `<mark>`, and expand-state restoration on clear
- **Inline Rename** — Double-click or right-click → Rename; Enter/Blur saves, Escape cancels
- **Delete** — Removes node and all descendants; cleans up expanded/selected state
- **Drag & Drop Move** — Drag files/folders into folders; prevents circular moves
- **Context Menu** — Right-click for Rename and Delete actions
- **Orphan Detection** — Nodes with missing parents are marked with an "orphan" badge
- **Edge Case Handling** — Empty datasets, missing parents, invalid references, circular move prevention

## Approach

### Data Transformation
The flat array is converted into a hierarchical tree using a two-pass O(n) algorithm:
1. **Pass 1**: Create a map of all nodes by ID
2. **Pass 2**: Link each node to its parent; orphan nodes (with missing parents) are added to roots

### State Management
All state is managed via React hooks in a custom `useTree` hook:
- `flatData` — single source of truth (flat array)
- `expandedIds` — Set of expanded folder IDs
- `selectedId` — currently selected node
- `searchQuery` — current filter text

All mutations are immutable (new arrays/sets on every change).

### Filtering
When a search query is active, the tree is traversed to find matching nodes and all their ancestor paths. During search, the expand state is auto-computed from ancestor paths. The pre-search expand state is saved and restored when the search is cleared.

### Performance
- Tree build is memoized with `useMemo` and recomputes only when `flatData` changes
- Filter matches are memoized separately
- Designed to handle 10k+ nodes efficiently

## Project Structure

```
src/
  components/
    Tree/
      TreeView.jsx     — Tree container with context menu
      TreeNode.jsx     — Individual tree node (recursive)
      treeUtils.js     — Tree build, search, and utility functions
    SearchBar.jsx      — Search input component
    Toolbar.jsx        — Expand All / Collapse All buttons
  hooks/
    useTree.js         — Custom hook managing all tree state and operations
  data/
    sampleData.js      — Sample flat dataset with orphan examples
  styles/
    tree.css           — VS Code dark theme styles
  App.jsx              — Root application component
  main.jsx             — React entry point
```