import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { lessonPathFromMeta } from '@/lib/content/paths';
import type { LessonMeta, RoadmapItem } from './types';

export function ChapterRoadmapSection({
  roadmap,
  first,
}: {
  roadmap: RoadmapItem[];
  first: LessonMeta | null;
}) {
  return (
    <section className='rounded-2xl border bg-card p-6 md:p-8'>
      <h2 className='text-xl font-semibold'>Roadmap</h2>
      <p className='mt-2 text-sm text-muted-foreground'>
        아래 순서대로 따라가면 HW1 문제를 풀기 위한 기본 흐름이 잡혀.
      </p>

      <div className='mt-4 grid gap-3 sm:grid-cols-2'>
        {roadmap.map((item) => (
          <Link
            key={item.href}
            href={item.disabled ? '#' : item.href}
            aria-disabled={!!item.disabled}
            onClick={(e) => {
              if (item.disabled) e.preventDefault();
            }}
            className={[
              'rounded-xl border p-4 transition',
              item.disabled
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-muted/40',
            ].join(' ')}
          >
            <div className='flex items-center justify-between gap-2'>
              <div className='font-semibold'>{item.title}</div>
              <span className='text-xs rounded-full border px-2 py-0.5 text-muted-foreground'>
                {item.tag}
              </span>
            </div>
            {!!item.desc && (
              <p className='mt-2 text-sm text-muted-foreground'>{item.desc}</p>
            )}
          </Link>
        ))}
      </div>

      <div className='mt-5 flex flex-wrap gap-2'>
        {first && (
          <Link
            href={lessonPathFromMeta({
              slug: first.slug,
              section: first.section ?? 'Lectures',
              group: first.group,
            })}
          >
            <Button>Start here</Button>
          </Link>
        )}
        <Link href='/modules/machine-learning/drills'>
          <Button variant='outline'>Open drills</Button>
        </Link>
      </div>
    </section>
  );
}
