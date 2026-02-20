import { LatexMath } from '@/components/latex-math';
import type { ReactNode } from 'react';

type PipelineStepsProps = {
  children?: ReactNode;
};

type PipelineStepProps = {
  title: string;
  text: string;
  math?: string;
};

export function PipelineSteps({ children }: PipelineStepsProps) {
  return (
    <ol className='list-decimal pl-5 space-y-2 text-sm text-muted-foreground'>
      {children}
    </ol>
  );
}

export function PipelineStep({ title, text, math }: PipelineStepProps) {
  return (
    <li className="overflow-x-auto">
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className="font-semibold text-foreground shrink-0">{title}</span>
        <span className="shrink-0">:</span>
        <span className="shrink-0">{text}</span>

        {math && (
          <span className="shrink-0 whitespace-nowrap [&_.katex]:whitespace-nowrap [&_.katex-display]:whitespace-nowrap">
            <LatexMath math={math} />
          </span>
        )}
      </span>
    </li>
  );
}


