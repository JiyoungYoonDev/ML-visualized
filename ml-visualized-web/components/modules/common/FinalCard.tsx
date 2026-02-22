import type { ReactNode } from 'react';
import Link from 'next/link';
import { SectionBox } from './SectionBox';
import { cn } from '@/lib/utils';

type FinalCardProps = {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function FinalCard({
  title,
  description,
  eyebrow = 'Next',
  ctaLabel,
  ctaHref,
  className,
}: FinalCardProps) {
  return (
    <SectionBox className={cn('mt-6 border-dashed', className)}>
      <div className='space-y-3 text-center'>
        <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          {eyebrow}
        </p>
        <h3 className='text-xl font-semibold tracking-tight'>{title}</h3>
        {description && (
          <div className='text-sm leading-7 text-muted-foreground'>
            {description}
          </div>
        )}

        {/* {ctaHref && ctaLabel && (
          <div className='pt-1'>
            <Link
              href={ctaHref}
              className='inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted/60'
            >
              {ctaLabel}
            </Link>
          </div>
        )} */}
      </div>
    </SectionBox>
  );
}
