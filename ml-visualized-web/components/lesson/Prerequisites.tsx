import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Block } from '@/components/lesson/Block';
import { Separator } from '@/components/ui/separator';

type PrerequisitesProps = {
  label?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
};

type PrerequisiteLinkProps = {
  href: string;
  title: string;
  description?: string;
};

export function Prerequisites({
  label = 'Prerequisites',
  title = 'Before you dive in',
  description = 'I recommend reviewing the following first:',
  children,
}: PrerequisitesProps) {
  return (
    <Block
      label={label}
      title={title}
      description={description}
      bordered={false}
    >
      <Separator className='mt-4 bg-foreground/30' />
      <div className='divide-y divide-foreground/20'>{children}</div>
      <Separator className='mt-4 bg-foreground/30' />
    </Block>
  );
}

export function PrerequisiteLink({
  href,
  title,
  description,
}: PrerequisiteLinkProps) {
  return (
    <Link
      href={href}
      className='flex items-center justify-between gap-3 py-4 text-sm font-semibold text-foreground transition hover:text-primary'
    >
      <div>
        <div>{title}</div>
        {description && (
          <div className='mt-1 text-xs font-normal text-muted-foreground'>
            {description}
          </div>
        )}
      </div>
      <ChevronRight className='h-4 w-4 text-muted-foreground' />
    </Link>
  );
}
