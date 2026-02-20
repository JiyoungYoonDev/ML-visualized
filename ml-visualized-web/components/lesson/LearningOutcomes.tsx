import React from 'react';
import { Block } from '@/components/lesson/Block';

type LearningOutcomesProps = {
  label?: string;
  title?: string;
  intro?: string;
  items?: string[] | string;
  children?: React.ReactNode;
};

function getTextFromNode(node: React.ReactNode): string[] {
  if (typeof node === 'string') {
    return node
      .split('\n')
      .map((item) => item.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);
  }

  if (typeof node === 'number') {
    return [String(node)];
  }

  if (!node) {
    return [];
  }

  if (Array.isArray(node)) {
    return node.flatMap((child) => getTextFromNode(child));
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextFromNode(node.props.children);
  }

  return [];
}

function normalizeItems(
  items: LearningOutcomesProps['items'],
  children: LearningOutcomesProps['children'],
): string[] {
  const fromItems =
    typeof items === 'string'
      ? items
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)
      : Array.isArray(items)
        ? items.map((item) => String(item).trim()).filter(Boolean)
        : [];

  if (fromItems.length > 0) return fromItems;

  return getTextFromNode(children);
}

export function LearningOutcomes(props: LearningOutcomesProps) {
  const {
    label = 'Introduction',
    title = "What you'll be able to do after reading",
    intro = 'By the end of this section, you will be able to:',
    items = [],
    children,
  } = props;

  const safeItems = normalizeItems(items, children);

  return (
    <Block label={label} title={title} bordered={false} divider>
      <div className='p-4'>
        <div className='text-base font-semibold'>{intro}</div>
        <ul className='mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {safeItems.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className='rounded-lg border bg-card p-3 text-sm leading-6 text-muted-foreground'
            >
              <span className='font-semibold text-foreground'>#{index + 1}</span>{' '}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Block>
  );
}
