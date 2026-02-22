import type { ReactNode } from 'react';
import { SectionBox } from './SectionBox';

export function IntroCard({
  title,
  children,
  description,
}: {
  title: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <SectionBox>
      <div className='space-y-8'>
        <div className='border-l-4 border-blue-500 pl-4'>
          <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
          {description && (
            <p className='mt-2 text-muted-foreground'>{description}</p>
          )}
        </div>
      </div>
      <div className='mt-2 text-sm text-muted-foreground'>{children}</div>
    </SectionBox>
  );
}
