'use client';

import { useEffect } from 'react';

export default function useEscapeKey(onEscape) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onEscape(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEscape]);
}
