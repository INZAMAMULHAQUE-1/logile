import React, { useMemo } from 'react';

/**
 * FileTypeFilter component — filters files by type
 */
export default function FileTypeFilter({ selectedFilter, onFilterChange }) {
  // Common file type filters
  const fileTypes = useMemo(() => [
    { id: 'all', label: 'All Files', icon: '📄', extensions: [] },
    { id: 'images', label: 'Images', icon: '🖼️', extensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'] },
    { id: 'documents', label: 'Documents', icon: '📝', extensions: ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx', '.csv'] },
    { id: 'code', label: 'Code', icon: '💻', extensions: ['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.json', '.py', '.java', '.cpp', '.c', '.go', '.rs', '.rb', '.php'] },
    { id: 'video', label: 'Videos', icon: '🎥', extensions: ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv'] },
    { id: 'audio', label: 'Audio', icon: '🎵', extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'] },
    { id: 'archives', label: 'Archives', icon: '📦', extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'] },
  ], []);

  return (
    <div className="file-type-filter">
      <div className="filter-label">🔍 Filter:</div>
      <div className="filter-buttons">
        {fileTypes.map((type) => (
          <button
            key={type.id}
            className={`filter-btn ${selectedFilter === type.id ? 'active' : ''}`}
            onClick={() => onFilterChange(type.id)}
            title={type.label}
          >
            <span className="filter-icon">{type.icon}</span>
            <span className="filter-name">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
