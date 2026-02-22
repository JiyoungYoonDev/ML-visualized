import type { ReactNode } from 'react';
import { SectionBox } from './SectionBox';
import { cn } from '@/lib/utils';

type ExplainListItem = {
  term?: ReactNode;
  description: ReactNode;
};

type ExplainCardProps = {
  title: string;
  description?: ReactNode;
  listItems?: ExplainListItem[];
  children?: ReactNode;
  visual?: ReactNode;
  visualCaption?: ReactNode;
  visualPosition?: 'left' | 'right';
  className?: string;
  contentClassName?: string;
  listClassName?: string;
  listItemClassName?: string;
  listTermClassName?: string;
  visualClassName?: string;
};

export function ExplainCard({
  title,
  description,
  listItems,
  children,
  visual,
  visualCaption,
  visualPosition = 'right',
  className,
  contentClassName,
  listClassName,
  listItemClassName,
  listTermClassName,
  visualClassName,
}: ExplainCardProps) {
  const contentBlock = (
    <div className={cn('space-y-4', contentClassName)}>
      <h2 className='text-xl font-bold tracking-tight'>{title}</h2>
      {description && <div className='text-sm leading-7'>{description}</div>}
      {listItems && listItems.length > 0 && (
        <ul
          className={cn(
            'list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground/90',
            listClassName,
          )}
        >
          {listItems.map((item, index) => (
            <li
              key={index}
              className={cn('marker:text-muted-foreground', listItemClassName)}
            >
              {item.term && (
                <span
                  className={cn(
                    'font-semibold text-foreground',
                    listTermClassName,
                  )}
                >
                  {item.term}
                </span>
              )}
              {item.term ? ': ' : null}
              <span>{item.description}</span>
            </li>
          ))}
        </ul>
      )}
      {children && (
        <div className='text-sm text-muted-foreground'>{children}</div>
      )}
    </div>
  );

  const visualBlock = visual ? (
    <div className='space-y-2'>
      <div
        className={cn(
          'w-full overflow-hidden rounded-2xl border bg-muted/20 p-4',
          visualClassName,
        )}
      >
        {visual}
      </div>
      {visualCaption && (
        <div className='text-xs text-muted-foreground'>{visualCaption}</div>
      )}
    </div>
  ) : null;

  return (
    <SectionBox className={cn('mt-6', className)}>
      {visualBlock ? (
        <div className='grid gap-6 lg:grid-cols-2 lg:items-center'>
          {visualPosition === 'left' ? (
            <>
              {visualBlock}
              {contentBlock}
            </>
          ) : (
            <>
              {contentBlock}
              {visualBlock}
            </>
          )}
        </div>
      ) : (
        contentBlock
      )}
    </SectionBox>
  );
}
