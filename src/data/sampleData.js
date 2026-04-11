/**
 * Sample flat dataset for the file explorer.
 * Each node has: id, name, parentId (null for root), type ('file' | 'folder'), size (optional, bytes).
 */
const sampleData = [
  // Root-level folders
  { id: 1, name: 'src', parentId: null, type: 'folder' },
  { id: 2, name: 'public', parentId: null, type: 'folder' },
  { id: 3, name: 'node_modules', parentId: null, type: 'folder' },

  // Root-level files
  { id: 4, name: 'package.json', parentId: null, type: 'file', size: 1024 },
  { id: 5, name: 'README.md', parentId: null, type: 'file', size: 2048 },
  { id: 6, name: 'vite.config.js', parentId: null, type: 'file', size: 512 },
  { id: 7, name: '.gitignore', parentId: null, type: 'file', size: 128 },

  // src/ children
  { id: 10, name: 'components', parentId: 1, type: 'folder' },
  { id: 11, name: 'hooks', parentId: 1, type: 'folder' },
  { id: 12, name: 'styles', parentId: 1, type: 'folder' },
  { id: 13, name: 'App.jsx', parentId: 1, type: 'file', size: 3072 },
  { id: 14, name: 'main.jsx', parentId: 1, type: 'file', size: 256 },
  { id: 15, name: 'index.css', parentId: 1, type: 'file', size: 1536 },

  // src/components/ children
  { id: 20, name: 'Header.jsx', parentId: 10, type: 'file', size: 1024 },
  { id: 21, name: 'Footer.jsx', parentId: 10, type: 'file', size: 768 },
  { id: 22, name: 'Sidebar.jsx', parentId: 10, type: 'file', size: 2048 },
  { id: 23, name: 'Button', parentId: 10, type: 'folder' },
  { id: 24, name: 'Modal', parentId: 10, type: 'folder' },

  // src/components/Button/ children
  { id: 30, name: 'Button.jsx', parentId: 23, type: 'file', size: 640 },
  { id: 31, name: 'Button.css', parentId: 23, type: 'file', size: 384 },
  { id: 32, name: 'Button.test.js', parentId: 23, type: 'file', size: 512 },

  // src/components/Modal/ children
  { id: 33, name: 'Modal.jsx', parentId: 24, type: 'file', size: 1280 },
  { id: 34, name: 'Modal.css', parentId: 24, type: 'file', size: 480 },

  // src/hooks/ children
  { id: 40, name: 'useAuth.js', parentId: 11, type: 'file', size: 896 },
  { id: 41, name: 'useFetch.js', parentId: 11, type: 'file', size: 1024 },
  { id: 42, name: 'useLocalStorage.js', parentId: 11, type: 'file', size: 640 },

  // src/styles/ children
  { id: 50, name: 'global.css', parentId: 12, type: 'file', size: 2560 },
  { id: 51, name: 'variables.css', parentId: 12, type: 'file', size: 512 },
  { id: 52, name: 'mixins.css', parentId: 12, type: 'file', size: 384 },

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
