'use client';

import { useState } from 'react';

export default function useCopyToClipboard(resetDelayMs) {
  const [copied, setCopied] = useState(false);

  function copy(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelayMs);
    });
  }

  return { copied, copy };
}
