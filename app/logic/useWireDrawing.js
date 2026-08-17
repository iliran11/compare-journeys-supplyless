'use client';

import { useEffect, useRef, useState } from 'react';

export default function useWireDrawing(result, sortBy) {
  const [wires, setWires] = useState({ viewBox: '0 0 0 0', paths: [] });
  const boardRef = useRef(null);
  const tcColRef = useRef(null);
  const bawColRef = useRef(null);

  function drawWires() {
    const board = boardRef.current;
    if (!board || !tcColRef.current || !bawColRef.current) return;
    const boardRect = board.getBoundingClientRect();
    const rightByGroup = new Map();
    for (const el of tcColRef.current.children) {
      if (!el.dataset || el.dataset.pair == null) continue;
      if (!rightByGroup.has(el.dataset.pair)) rightByGroup.set(el.dataset.pair, []);
      rightByGroup.get(el.dataset.pair).push(el);
    }
    const paths = [];
    for (const el of bawColRef.current.children) {
      if (!el.dataset || el.dataset.pair == null) continue;
      const others = rightByGroup.get(el.dataset.pair) || [];
      for (const other of others) {
        const a = el.getBoundingClientRect();
        const b = other.getBoundingClientRect();
        const x1 = a.right - boardRect.left;
        const y1 = a.top + a.height / 2 - boardRect.top;
        const x2 = b.left - boardRect.left;
        const y2 = b.top + b.height / 2 - boardRect.top;
        const mx = (x1 + x2) / 2;
        paths.push({
          pairId: Number(el.dataset.pair),
          d: 'M ' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ', ' + mx + ' ' + y2 + ', ' + x2 + ' ' + y2
        });
      }
    }
    setWires({ viewBox: '0 0 ' + boardRect.width + ' ' + boardRect.height, paths: paths });
  }

  useEffect(() => {
    if (!result) return;
    const raf = requestAnimationFrame(drawWires);
    window.addEventListener('resize', drawWires);
    const observer = new ResizeObserver(drawWires);
    if (boardRef.current) observer.observe(boardRef.current);
    if (tcColRef.current) observer.observe(tcColRef.current);
    if (bawColRef.current) observer.observe(bawColRef.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', drawWires);
      observer.disconnect();
    };
  }, [result, sortBy]);

  return { wires, boardRef, tcColRef, bawColRef };
}
