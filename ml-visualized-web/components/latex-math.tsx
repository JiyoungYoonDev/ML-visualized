import { InlineMath, BlockMath } from 'react-katex';
import { cn } from '@/lib/utils';

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
      <div
        className={cn('text-foreground [&_.katex]:text-foreground', className)}
      >
        <BlockMath math={safeMath} />
      </div>
    );
  return (
    <span
      className={cn('text-foreground [&_.katex]:text-foreground', className)}
    >
      <InlineMath math={safeMath} />
    </span>
  );
}
