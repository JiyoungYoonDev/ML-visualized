import type { ComponentProps } from 'react';
import { Separator } from '@/components/ui/separator';

type SectionSeparatorProps = ComponentProps<typeof Separator>;

export function SectionSeparator({
  className,
  ...props
}: SectionSeparatorProps) {
  return (
    <Separator
      className={['bg-foreground/35', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
