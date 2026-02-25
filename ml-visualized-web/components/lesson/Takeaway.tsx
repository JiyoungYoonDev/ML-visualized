import type { ReactNode } from 'react';
import { Children, isValidElement } from 'react';
import { Block } from '@/components/lesson/Block';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@radix-ui/react-separator';

type TakeawayProps = {
  label?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
};

type TakeawayItemProps = {
  value: string;
  title: string;
  intro?: ReactNode;
  items?: ReactNode[];
  children?: ReactNode;
};

type TakeawayLeadListProps = {
  title: string;
  intro?: ReactNode;
  items?: ReactNode | ReactNode[];
  className?: string;
  children?: ReactNode;
};

function getDefaultOpenValue(children: ReactNode): string | undefined {
  const nodes = Children.toArray(children);
  const first = nodes.find(
    (node) =>
      isValidElement<{ value?: string }>(node) &&
      typeof node.props.value === 'string',
  );

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
  const nodes = Children.toArray(children);
  const leadNodes = nodes.filter(
    (node) =>
      !(
        isValidElement<{ value?: string }>(node) &&
        typeof node.props.value === 'string'
      ),
  );
  const accordionNodes = nodes.filter(
    (node) =>
      isValidElement<{ value?: string }>(node) &&
      typeof node.props.value === 'string',
  );
  const defaultOpenValue = getDefaultOpenValue(accordionNodes);

  return (
    <>
      <Block
        bordered={false}
        divider
        label={label}
        title={title}
        description={description}
      >
        {leadNodes.length > 0 || accordionNodes.length > 0 ? (
          <Separator
            decorative
            orientation='horizontal'
            className='mb-3 h-px w-full shrink-0 bg-foreground/35'
          />
        ) : null}
        {leadNodes.length > 0 ? <div>{leadNodes}</div> : null}

        {accordionNodes.length > 0 ? (
          <Accordion
            type='single'
            collapsible
            defaultValue={defaultOpenValue}
            className='w-full'
          >
            {accordionNodes}
          </Accordion>
        ) : null}
      </Block>
    </>
  );
}

export function TakeawayItem({
  value,
  title,
  intro,
  items,
  children,
}: TakeawayItemProps) {
  const hasList = Array.isArray(items) && items.length > 0;

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className='px-5 sm:px-6'>{title}</AccordionTrigger>
      <AccordionContent className='px-5 sm:px-6'>
        <div className='not-prose text-sm text-muted-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_li]:list-item'>
          {hasList ? (
            <div className='space-y-3'>
              {intro && <p className='text-sm sm:text-base'>{intro}</p>}
              <ul className='list-disc space-y-2 text-sm sm:text-base'>
                {items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            children
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function TakeawayLeadList({
  title,
  intro,
  items,
  className,
  children,
}: TakeawayLeadListProps) {
  const normalizedItems = Array.isArray(items)
    ? items
    : items != null
      ? [items]
      : [];
  const hasChildren = Children.count(children) > 0;
  const hasItems = normalizedItems.length > 0;

  if (!intro && !hasItems && !hasChildren) {
    return null;
  }

  return (
    <div className={`bg-card p-5  ${className ?? ''}`.trim()}>
      <h4 className='text-base sm:text-lg font-semibold text-foreground'>
        {title}
      </h4>
      <div className='mt-3 space-y-3 text-sm sm:text-base text-muted-foreground'>
        {intro ? <p>{intro}</p> : null}
        {hasChildren ? (
          <div className='not-prose text-sm text-muted-foreground [&_ul]:m-0 [&_ul]:list-inside [&_ul]:list-disc [&_ul]:space-y-2 [&_li]:list-item'>
            {children}
          </div>
        ) : hasItems ? (
          <ul className='m-0 list-inside list-disc space-y-2'>
            {normalizedItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
