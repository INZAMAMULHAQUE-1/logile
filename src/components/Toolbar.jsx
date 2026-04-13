import { useState, useRef, memo } from 'react';

/**
 * Toolbar component — provides Expand All and Collapse All controls.
 */
const Toolbar = memo(function Toolbar({ onExpandAll, onCollapseAll }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);

  const handleExpandAll = async () => {
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    setIsProcessing(true);
    
    try {
      // Process in the next tick to allow UI to update
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          onExpandAll();
          resolve();
        });
      });
    } finally {
      // Reset after a longer delay to show completed state
      setTimeout(() => {
        isProcessingRef.current = false;
        setIsProcessing(false);
      }, 300);
    }
  };

  const handleCollapseAll = () => {
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    setIsProcessing(true);
    
    try {
      onCollapseAll();
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false;
        setIsProcessing(false);
      }, 100);
    }
  };

  return (
    <div className="toolbar">
      <button 
        className="toolbar-btn" 
        onClick={handleExpandAll} 
        title="Expand All - May take a moment for large trees"
        disabled={isProcessing}
      >
        {isProcessing ? '⏳' : '⊞'} {isProcessing ? 'Expanding...' : 'Expand All'}
      </button>
      <button 
        className="toolbar-btn" 
        onClick={handleCollapseAll} 
        title="Collapse All"
        disabled={isProcessing}
      >
        ⊟ Collapse All
      </button>
    </div>
  );
});

export default Toolbar;
