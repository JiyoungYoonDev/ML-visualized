import type { ReactNode } from 'react';
import { LatexMath } from '@/components/latex-math';
import {
  ReadingNotation,
  ReadingNotationItem,
} from '@/components/lesson/ReadingNotation';

type NotationGuideProps = {
  label?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
};

type NotationGuideItemProps = {
  value: string;
  title: ReactNode;
  formula?: string;
  reading?: string;
  note?: string;
  children?: ReactNode;
  title_symbol?: string;
};

export function NotationGuide({
  label = 'Notation',
  title = 'Reading Notation (Sentence ↔ Formula)',
  description = "Think of formulas as 'English sentences' for faster understanding.",
  children,
}: NotationGuideProps) {
  return (
    <ReadingNotation label={label} title={title} description={description}>
      {children}
    </ReadingNotation>
  );
}

export function NotationGuideItem({
  value,
  title,
  formula,
  reading,
  note,
  children,
  title_symbol,
}: NotationGuideItemProps) {
  console.log(typeof title, title);

  return (
    <ReadingNotationItem
      value={value}
      title={
        <div className='flex items-center justify-between w-full pr-4'>
          <span className='font-medium text-foreground'>{title}</span>
          {title_symbol && <span>:</span>}
          {title_symbol && (
            <span className='text-sm bg-muted/50 px-2 py-0.5'>
              <LatexMath math={title_symbol} />
            </span>
          )}
        </div>
      }
    >
      {formula && <LatexMath block math={formula} />}
      {reading && <div>{reading}</div>}
      {note && <div>{note}</div>}
      {children}
    </ReadingNotationItem>
  );
}
