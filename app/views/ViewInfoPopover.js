'use client';

import { useState } from 'react';

export default function ViewInfoPopover({ formula }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="info-popover">
      <button
        type="button"
        className="info-icon"
        aria-label="Show formula"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        i
      </button>
      {open && (
        <>
          <div className="info-backdrop" onClick={() => setOpen(false)} />
          <div className="info-popup" onClick={(e) => e.stopPropagation()}>
            {formula}
          </div>
        </>
      )}
    </span>
  );
}
