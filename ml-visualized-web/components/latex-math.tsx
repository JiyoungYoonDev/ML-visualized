'use client';

import { InlineMath, BlockMath } from 'react-katex';

type MathProps = {
  math: string;
  block?: boolean;
  className?: string;
};

export function LatexMath({ math, block = false, className }: MathProps) {
  const safeMath = typeof math === 'string' ? math : String(math ?? '');

  if (!safeMath.trim()) {
    return null;
  }

  if (block)
    return (
      <div className={className}>
        <BlockMath math={safeMath} />
      </div>
    );
  return (
    <span className={className}>
      <InlineMath math={safeMath} />
    </span>
  );
}
