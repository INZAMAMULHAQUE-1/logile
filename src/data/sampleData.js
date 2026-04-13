/**
 * Sample flat dataset for the file explorer.
 * Each node has: id, name, parentId (null for root), type ('file' | 'folder'), size (optional, bytes), content (optional, for files).
 */
const sampleData = [
  // Root-level folders
  { id: 1, name: 'src', parentId: null, type: 'folder' },
  { id: 2, name: 'public', parentId: null, type: 'folder' },
  { id: 3, name: 'node_modules', parentId: null, type: 'folder' },

  // Root-level files
  {
    id: 4,
    name: 'package.json',
    parentId: null,
    type: 'file',
    size: 1024,
    content: `{
  "name": "logile",
  "version": "1.0.0",
  "description": "VS Code style file explorer",
  "main": "src/main.jsx",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.0"
  }
}`,
  },
  {
    id: 5,
    name: 'README.md',
    parentId: null,
    type: 'file',
    size: 2048,
    content: `# Logile - File Explorer

A VS Code-style file explorer built with React and Vite.

## Features

- 📁 Hierarchical file tree view
- 🔍 Search and filter files
- ✏️ Inline rename functionality
- 🗑️ Delete files and folders
- 🎯 Drag and drop support
- 📄 Code viewer for file content
- ⌨️ Keyboard shortcuts
- 🎨 Dark theme (VS Code style)

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Project Structure

\`\`\`
.
├── src/
│   ├── components/
│   ├── hooks/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
\`\`\`

---

Built with React + Vite`,
  },
  {
    id: 6,
    name: 'vite.config.js',
    parentId: null,
    type: 'file',
    size: 512,
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})`,
  },
  {
    id: 7,
    name: '.gitignore',
    parentId: null,
    type: 'file',
    size: 128,
    content: `node_modules/
dist/
*.log
.env
.DS_Store`,
  },

  // src/ children
  { id: 10, name: 'components', parentId: 1, type: 'folder' },
  { id: 11, name: 'hooks', parentId: 1, type: 'folder' },
  { id: 12, name: 'styles', parentId: 1, type: 'folder' },
  {
    id: 13,
    name: 'App.jsx',
    parentId: 1,
    type: 'file',
    size: 3072,
    content: `import SearchBar from './components/SearchBar.jsx';
import Toolbar from './components/Toolbar.jsx';
import TreeView from './components/Tree/TreeView.jsx';
import CodeViewer from './components/CodeViewer.jsx';
import { useTree } from './hooks/useTree.js';
import sampleData from './data/sampleData.js';
import './styles/tree.css';

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
  } = useTree(sampleData);

  // Find selected node
  const selectedNode = selectedId 
    ? sampleData.find(n => n.id === selectedId)
    : null;

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
          />
        </div>
      </aside>
      <main className="main-content">
        <CodeViewer node={selectedNode} flatData={sampleData} />
      </main>
    </div>
  );
}`,
  },
  {
    id: 14,
    name: 'main.jsx',
    parentId: 1,
    type: 'file',
    size: 256,
    content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
  },
  {
    id: 15,
    name: 'index.css',
    parentId: 1,
    type: 'file',
    size: 1536,
    content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
  },

  // src/components/ children
  {
    id: 20,
    name: 'Header.jsx',
    parentId: 10,
    type: 'file',
    size: 1024,
    content: `export default function Header() {
  return (
    <header className="header">
      <h1>File Explorer</h1>
      <p>Navigate your project structure</p>
    </header>
  );
}`,
  },
  {
    id: 21,
    name: 'Footer.jsx',
    parentId: 10,
    type: 'file',
    size: 768,
    content: `export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2024 Logile - VS Code Style Explorer</p>
    </footer>
  );
}`,
  },
  {
    id: 22,
    name: 'Sidebar.jsx',
    parentId: 10,
    type: 'file',
    size: 2048,
    content: `import { useState } from 'react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={\`sidebar \${isOpen ? 'open' : 'closed'}\`}>
      <button onClick={toggleSidebar} className="toggle-btn">
        {isOpen ? '◄' : '►'}
      </button>
      <nav>
        <ul>
          <li><a href="#explorer">Explorer</a></li>
          <li><a href="#search">Search</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
      </nav>
    </div>
  );
}`,
  },
  { id: 23, name: 'Button', parentId: 10, type: 'folder' },
  { id: 24, name: 'Modal', parentId: 10, type: 'folder' },

  // src/components/Button/ children
  {
    id: 30,
    name: 'Button.jsx',
    parentId: 23,
    type: 'file',
    size: 640,
    content: `export default function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button className={\`btn btn-\${variant}\`} onClick={onClick}>
      {children}
    </button>
  );
}`,
  },
  {
    id: 31,
    name: 'Button.css',
    parentId: 23,
    type: 'file',
    size: 384,
    content: `.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #0078d4;
  color: white;
}

.btn-primary:hover {
  background-color: #005a9e;
}`,
  },
  {
    id: 32,
    name: 'Button.test.js',
    parentId: 23,
    type: 'file',
    size: 512,
    content: `import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click Me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});`,
  },

  // src/components/Modal/ children
  {
    id: 33,
    name: 'Modal.jsx',
    parentId: 24,
    type: 'file',
    size: 1280,
    content: `import { useState } from 'react';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}`,
  },
  {
    id: 34,
    name: 'Modal.css',
    parentId: 24,
    type: 'file',
    size: 480,
    content: `.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
}`,
  },

  // src/hooks/ children
  {
    id: 40,
    name: 'useAuth.js',
    parentId: 11,
    type: 'file',
    size: 896,
    content: `import { useState, useCallback } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      // API call here
      setUser({ email });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login };
}`,
  },
  {
    id: 41,
    name: 'useFetch.js',
    parentId: 11,
    type: 'file',
    size: 1024,
    content: `import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}`,
  },
  {
    id: 42,
    name: 'useLocalStorage.js',
    parentId: 11,
    type: 'file',
    size: 640,
    content: `import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}`,
  },

  // src/styles/ children
  {
    id: 50,
    name: 'global.css',
    parentId: 12,
    type: 'file',
    size: 2560,
    content: `/* Global Styles */

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

body {
  line-height: 1.6;
}

a {
  color: #0066cc;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  cursor: pointer;
}`,
  },
  {
    id: 51,
    name: 'variables.css',
    parentId: 12,
    type: 'file',
    size: 512,
    content: `:root {
  --primary-color: #0078d4;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}`,
  },
  {
    id: 52,
    name: 'mixins.css',
    parentId: 12,
    type: 'file',
    size: 384,
    content: `/* Reusable CSS Mixins */

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}`,
  },

  // public/ children
  { id: 60, name: 'index.html', parentId: 2, type: 'file', size: 512 },
  { id: 61, name: 'favicon.ico', parentId: 2, type: 'file', size: 4096 },
  { id: 62, name: 'assets', parentId: 2, type: 'folder' },

  // public/assets/ children
  { id: 70, name: 'logo.svg', parentId: 62, type: 'file', size: 2048 },
  { id: 71, name: 'images', parentId: 62, type: 'folder' },

  // public/assets/images/ children
  { id: 80, name: 'hero.png', parentId: 71, type: 'file', size: 51200 },
  { id: 81, name: 'banner.jpg', parentId: 71, type: 'file', size: 30720 },

  // node_modules/ children (just a few representative)
  { id: 90, name: 'react', parentId: 3, type: 'folder' },
  { id: 91, name: 'vite', parentId: 3, type: 'folder' },

  // node_modules/react/ children
  { id: 100, name: 'index.js', parentId: 90, type: 'file', size: 4096 },
  { id: 101, name: 'package.json', parentId: 90, type: 'file', size: 2048 },

  // node_modules/vite/ children
  { id: 102, name: 'index.js', parentId: 91, type: 'file', size: 8192 },
  { id: 103, name: 'package.json', parentId: 91, type: 'file', size: 1536 },

  // Orphan node — parent ID 999 does not exist
  { id: 200, name: 'orphan-config.yml', parentId: 999, type: 'file', size: 256 },
  { id: 201, name: 'lost-folder', parentId: 888, type: 'folder' },
  { id: 202, name: 'lost-child.txt', parentId: 201, type: 'file', size: 64 },
];

export default sampleData;
