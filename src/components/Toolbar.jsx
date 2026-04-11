/**
 * Toolbar component — provides Expand All and Collapse All controls.
 */
export default function Toolbar({ onExpandAll, onCollapseAll }) {
  return (
    <div className="toolbar">
      <button className="toolbar-btn" onClick={onExpandAll} title="Expand All">
        ⊞ Expand All
      </button>
      <button className="toolbar-btn" onClick={onCollapseAll} title="Collapse All">
        ⊟ Collapse All
      </button>
    </div>
  );
}
