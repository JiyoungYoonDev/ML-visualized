import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { SectionBox } from '@/components/modules/common/SectionBox';
import { lessonPathFromMeta } from '@/lib/content/paths';
import type { SectionGroup } from './types';

export function SectionLessonsGrid({ sections }: { sections: SectionGroup[] }) {
  return (
    <>
      {sections.map(({ section, items }) => (
        <SectionBox key={section}>
          <h2 className='text-xl font-semibold'>{section}</h2>
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            {section !== 'Bootcamps' && items[0] && (
              <Link
                href={lessonPathFromMeta({
                  slug: items[0].slug,
                  section: items[0].section ?? section,
                  group: items[0].group,
                })}
                className='sm:col-span-2 rounded-xl border border-foreground/20 bg-muted/50 p-5 hover:bg-muted/70 transition'
              >
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-2 font-semibold'>
                    <Sparkles className='h-4 w-4 text-muted-foreground' />
                    <span>{items[0].title}</span>
                  </div>
                  <span className='text-xs rounded-full border px-2 py-0.5 text-muted-foreground'>
                    Overview
                  </span>
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {items[0].summary ??
                    'Start this sub-module with a quick overview before diving into each lesson.'}
                </p>
              </Link>
            )}

            {items.slice(1).map((lesson) => (
              <Link
                key={lesson.slug}
                href={lessonPathFromMeta({
                  slug: lesson.slug,
                  section: lesson.section ?? section,
                  group: lesson.group,
                })}
                className='rounded-xl border p-4 hover:bg-muted/40 transition'
              >
                <div className='font-semibold'>{lesson.title}</div>
                {lesson.summary && (
                  <p className='mt-2 text-sm text-muted-foreground'>
                    {lesson.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </SectionBox>
      ))}
    </>
  );
}
