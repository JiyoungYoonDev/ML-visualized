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
import { cn } from '@/lib/utils';
import { SectionSeparator } from './SectionSeparator';

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
  return (first as any)?.props?.value;
}

export function Takeaway({
  label = 'Summary',
  title = 'Key Takeaways',
  description = 'Focus on these core concepts to solidify your understanding.',
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
    <Block
      bordered={false}
      divider
      label={label}
      title={title}
      description={description}
    >
      <div className='mt-4 space-y-8'>
        {leadNodes.length > 0 && <div className='grid gap-6'>{leadNodes}</div>}

        {accordionNodes.length > 0 && (
          <>
            <SectionSeparator />
            <Accordion
              type='single'
              collapsible
              defaultValue={defaultOpenValue}
              className='w-full'
            >
              {accordionNodes}
            </Accordion>
          </>
        )}
      </div>
    </Block>
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
    <AccordionItem value={value} className='border-b border-slate-200 group'>
      <AccordionTrigger className='hover:no-underline text-left'>
        <div className='flex items-baseline gap-4'>
          <span className='text-xs font-black text-slate-400 group-data-[state=open]:text-slate-900 uppercase font-mono'>
            {value}
          </span>
          <span className='text-lg font-black tracking-tight text-slate-900 group-data-[state=open]:translate-x-1 transition-transform'>
            {title}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className='pt-2'>
        <div className='border-l-2 border-slate-900 ml-[2.5rem] pl-6 py-1'>
          <div className='not-prose text-sm leading-relaxed text-slate-600'>
            {hasList ? (
              <div className='space-y-4'>
                {intro && (
                  <p className='font-bold text-slate-900 text-base'>{intro}</p>
                )}
                <ul className='space-y-3'>
                  {items.map((item, index) => (
                    <li key={index} className='flex gap-2 items-start'>
                      <span className='mt-1.5 h-1.5 w-1.5 shrink-0 bg-slate-900 rounded-full' />
                      <span className='text-slate-700'>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              children
            )}
          </div>
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

  return (
    <div
      className={cn(
        'border-l-2 border-slate-900 bg-slate-50 p-4 shadow-sm',
        className,
      )}
    >
      <h4 className='text-xl font-black uppercase tracking-tighter text-slate-900 mb-4'>
        {title}
      </h4>

      <div className='space-y-4 text-sm leading-7 text-slate-700'>
        {intro && (
          <p className='font-bold text-slate-900  border-slate-200 inline-block'>
            {intro}
          </p>
        )}

        <div className='not-prose space-y-3'>
          {hasChildren ? (
            children
          ) : normalizedItems.length > 0 ? (
            <ul className='space-y-3'>
              {normalizedItems.map((item, index) => (
                <li key={index} className='flex items-start gap-3'>
                  <span className='mt-2.5 h-1 w-4 shrink-0 bg-slate-400' />
                  <span className='font-medium'>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
