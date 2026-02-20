import type { ReactNode } from 'react';
import { Children, isValidElement } from 'react';
import { Block } from '@/components/lesson/Block';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type ReadingNotationProps = {
  label?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
};

type ReadingNotationItemProps = {
  value: string;
  title: ReactNode;
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

export function ReadingNotation({
  label = 'Notation',
  title = 'Reading Notation (Sentence ↔ Formula)',
  description = "Think of formulas as 'English sentences' for faster understanding.",
  children,
}: ReadingNotationProps) {
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

export function ReadingNotationItem({
  value,
  title,
  children,
}: ReadingNotationItemProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>
        <div className="text-left font-bold">{title}</div>
      </AccordionTrigger>
      <AccordionContent>
        <div className='not-prose space-y-2 text-sm text-muted-foreground'>
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
