import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const baseClassName = 'rounded-2xl border bg-card p-6 md:p-8';

export function SectionBox({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn(baseClassName, className)}>{children}</section>;
}
