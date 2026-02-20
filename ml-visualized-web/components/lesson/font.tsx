import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type FontProps = {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
};

export function Font({ children, title, subtitle, className }: FontProps) {
  const heading = title ?? children;

  if (!heading) return null;

  return (
    <div>
      <h1 className='text-3xl font-extrabold tracking-tight md:text-4xl'>
        {heading}
      </h1>
    </div>
  );
}
