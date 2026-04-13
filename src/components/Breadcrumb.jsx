import React from 'react';

/**
 * Breadcrumb component — shows the file path and allows navigation
 */
export default function Breadcrumb({ path, onNavigate }) {
  if (!path || path.length === 0) {
    return null;
  }

  return (
    <div className="breadcrumb">
      <button
        className="breadcrumb-item breadcrumb-root"
        onClick={() => onNavigate(null)}
        title="Go to root"
      >
        📁 Root
      </button>
      
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        const icon = item.type === 'folder' ? '📁' : '📄';
        
        return (
          <React.Fragment key={item.id}>
            <span className="breadcrumb-separator">/</span>
            <button
              className={`breadcrumb-item ${isLast ? 'breadcrumb-current' : ''}`}
              onClick={() => !isLast && onNavigate(item.id)}
              disabled={isLast}
              title={isLast ? item.name : `Go to ${item.name}`}
            >
              {icon} {item.name}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
