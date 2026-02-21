import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { lessonPathFromMeta } from '@/lib/content/paths';
import type { LessonMeta } from './types';

export function ChapterHeroSection({ first }: { first: LessonMeta | null }) {
  return (
    <section className='rounded-2xl border bg-card p-6 md:p-10'>
      <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
        Chapter 1
      </p>
      <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
        Foundations (HW1-ready path)
      </h1>
      <p className='mt-3 text-sm leading-7 text-muted-foreground'>
        목표: Lecture 1.1 ~ 1.4 내용을 “수식/표기 → 직관 → 문제풀이 패턴”으로
        몸에 익혀서, HW1 스타일 문제를 스스로 풀 수 있게 만들기.
      </p>

      <div className='mt-5 flex flex-wrap gap-2'>
        {first && (
          <Link
            href={lessonPathFromMeta({
              slug: first.slug,
              section: first.section ?? 'Lectures',
              group: first.group,
            })}
          >
            <Button>Start</Button>
          </Link>
        )}

        <Link href='/modules/bootcamps/notation'>
          <Button variant='outline'>Notation Bootcamp</Button>
        </Link>
      </div>

      <div className='mt-6 grid gap-3 sm:grid-cols-3'>
        <div className='rounded-lg border bg-muted/40 p-3'>
          <p className='text-xs text-muted-foreground'>Lesson Type</p>
          <p className='mt-1 text-sm font-semibold'>Concept + Practice</p>
        </div>
        <div className='rounded-lg border bg-muted/40 p-3'>
          <p className='text-xs text-muted-foreground'>Core Goal</p>
          <p className='mt-1 text-sm font-semibold'>HW-style readiness</p>
        </div>
        <div className='rounded-lg border bg-muted/40 p-3'>
          <p className='text-xs text-muted-foreground'>Setting</p>
          <p className='mt-1 text-sm font-semibold'>Math-heavy notation</p>
        </div>
      </div>
    </section>
  );
}
