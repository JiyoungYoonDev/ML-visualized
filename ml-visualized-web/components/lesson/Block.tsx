import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BlockProps = {
  label?: string;
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
};

export function Block({
  label,
  title,
  description,
  className,
  children,
}: BlockProps) {
  return (
    <section
      className={cn(
        'not-prose my-6 rounded-xl border bg-card p-5 md:p-6',
        className,
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
            <div className='mt-1 text-lg font-bold tracking-tight md:text-xl'>
              {title}
            </div>
          )}
          {description && (
            <div className='mt-2 text-base leading-7 text-muted-foreground'>
              {description}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
