import type { ReactNode } from 'react';
import { Children, isValidElement } from 'react';
import { Block } from '@/components/lesson/Block';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type TakeawayProps = {
  label?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
};

type TakeawayItemProps = {
  value: string;
  title: string;
  children?: ReactNode;
};

function getDefaultOpenValue(children: ReactNode): string | undefined {
  const nodes = Children.toArray(children);
  const first = nodes.find((node) => isValidElement<{ value?: string }>(node));

  if (!first || !isValidElement<{ value?: string }>(first)) {
    return undefined;
  }

  return first.props.value;
}

export function Takeaway({
  label = 'Takeaway',
  title = 'What you should walk away with',
  description = 'Lock in these three ideas first, then the rest of the lesson will feel much easier.',
  children,
}: TakeawayProps) {
  const defaultOpenValue = getDefaultOpenValue(children);

  return (
    <Block
      bordered={false}
      divider
      label={label}
      title={title}
      description={description}
    >
      <Accordion
        type='single'
        collapsible
        defaultValue={defaultOpenValue}
        className='w-full'
      >
        {children}
      </Accordion>
    </Block>
  );
}

export function TakeawayItem({ value, title, children }: TakeawayItemProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <div className='not-prose text-sm text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:list-item'>
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
