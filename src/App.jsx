import SearchBar from './components/SearchBar.jsx';
import Toolbar from './components/Toolbar.jsx';
import TreeView from './components/Tree/TreeView.jsx';
import { useTree } from './hooks/useTree.js';
import sampleData from './data/sampleData.js';
import './styles/tree.css';

/**
 * App component — root of the File Explorer application.
 * Renders a VS Code–style sidebar with search, toolbar, and tree view.
 */
export default function App() {
  const {
    tree,
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
  } = useTree(sampleData);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">Explorer</div>
        <SearchBar value={searchQuery} onChange={updateSearch} />
        <Toolbar onExpandAll={expandAll} onCollapseAll={collapseAll} />
        <div className="sidebar-content">
          <TreeView
            tree={tree}
            expandedIds={expandedIds}
            selectedId={selectedId}
            searchQuery={searchQuery}
            filterResult={filterResult}
            onToggleExpand={toggleExpand}
            onSelect={setSelectedId}
            onRename={renameNode}
            onDelete={deleteNode}
            onMove={moveNode}
          />
        </div>
      </aside>
      <main className="main-content">
        {selectedId
          ? `Selected node ID: ${selectedId}`
          : 'Select a file or folder to view details'}
      </main>
    </div>
  );
}
