import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DiagramSectionCardProps = {
  title: string;
  description: ReactNode;
  formula?: ReactNode;
  diagram: ReactNode;
  note?: ReactNode;
  className?: string;
  diagramClassName?: string;
};

export function DiagramSectionCard({
  title,
  description,
  formula,
  diagram,
  note,
  className,
  diagramClassName,
}: DiagramSectionCardProps) {
  return (
    <section
      className={cn(
        'relative mt-6 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl',
        className,
      )}
    >
      <div className='absolute right-0 top-0 h-64 w-64 -translate-y-32 translate-x-32 rounded-full bg-blue-500/10' />

      <div className='grid gap-8 lg:grid-cols-2 lg:items-center'>
        <div className='space-y-4'>
          <h3 className='text-xl font-bold'>{title}</h3>
          <div className='text-sm leading-relaxed text-slate-400'>
            {description}
          </div>
          {formula && (
            <div className='inline-block rounded-xl border border-white/10 bg-white/5 p-4'>
              {formula}
            </div>
          )}
        </div>

        <div
          className={cn(
            'relative flex min-h-[180px] w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:min-h-[240px] lg:min-h-[220px]',
            diagramClassName,
          )}
        >
          {diagram}
        </div>
      </div>

      {note && <div className='mt-4 text-xs italic text-slate-500'>{note}</div>}
    </section>
  );
}
