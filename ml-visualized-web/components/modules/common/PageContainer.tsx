import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const baseClassName = 'mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10 space-y-6';

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <main className={cn(baseClassName, className)}>{children}</main>;
}
