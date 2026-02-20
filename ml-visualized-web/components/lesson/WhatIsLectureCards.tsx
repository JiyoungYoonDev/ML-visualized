import type { ReactNode } from 'react';
import { Children, isValidElement } from 'react';
import { Block } from '@/components/lesson/Block';

type WhatIsLectureCardsProps = {
  label?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

type WhatIsLectureCardItemProps = {
  label: string;
  value: string;
};

type WhatIsLectureCardProps = {
  title: string;
  children?: ReactNode;
};

export function WhatIsLectureCards({
  label = 'Lecture',
  title,
  description,
  children,
}: WhatIsLectureCardsProps) {
  const cards = Children.toArray(children).filter((child) =>
    isValidElement<WhatIsLectureCardItemProps>(child),
  );

  return (
    <Block
      bordered={false}
      divider
      label={label}
      title={title}
      description={description}
    >
      <div className='grid gap-3 sm:grid-cols-3'>{cards}</div>
    </Block>
  );
}

export function WhatIsLectureCardItem({
  label,
  value,
}: WhatIsLectureCardItemProps) {
  return (
    <div className='rounded-lg border bg-muted/40 p-3'>
      <div className='text-sm font-semibold text-muted-foreground'>{label}</div>
      <div className='mt-1 text-base font-semibold'>{value}</div>
    </div>
  );
}

export function WhatIsLectureCard({ title, children }: WhatIsLectureCardProps) {
  return (
    <div className='rounded-lg border bg-muted/40 p-3'>
      <div className='text-sm text-foreground'>{title}</div>
      <div className='mt-1 text-sm font-semibold text-foreground'>{children}</div>
    </div>
  );
}
