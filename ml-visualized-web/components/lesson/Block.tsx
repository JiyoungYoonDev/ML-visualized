import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BlockProps = {
  label?: string;
  title?: string;
  titleId?: string;
  description?: ReactNode;
  className?: string;
  bordered?: boolean | 'true' | 'false';
  divider?: boolean;
  children: ReactNode;
};

export function Block({
  label,
  title,
  titleId,
  description,
  className,
  bordered,
  divider = false,
  children,
}: BlockProps) {
  const isBordered = bordered === true || bordered === 'true';
  return (
    <section
        className={cn(
        'not-prose my-8',
        isBordered 
          ? 'rounded-xl border bg-card p-5 md:p-6 shadow-sm' 
          : 'px-0 py-2',
        className
      )}
    >
      {(label || title || description) && (
        <div className='mb-4'>
          {label && (
            <div className='text-xs font-bold uppercase tracking-wide text-muted-foreground'>
              {label}
            </div>
          )}
          {title && (
            <div
              id={titleId}
              className='mt-1 scroll-mt-28 text-lg font-bold tracking-tight md:text-xl'
            >
              {title}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
