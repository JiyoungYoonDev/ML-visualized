'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PROGRESS_EVENT, readDone, toggleDone } from '@/lib/progress';
import { Check } from 'lucide-react';

export default function LessonFooter({
  chapter,
  slug,
  prev,
  next,
}: {
  chapter: string;
  slug: string;
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
}) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setDone(readDone());
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(PROGRESS_EVENT, sync);
    };
  }, []);

  const completed = useMemo(() => done.includes(slug), [done, slug]);
  console.log('LessonFooter render', { slug, prev, next, completed });
  return (
    <div className='mt-10 rounded-2xl border bg-card p-4 md:p-6 space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='text-sm text-muted-foreground'>
          Chapter:{' '}
          <span className='text-foreground font-medium'>{chapter}</span>
        </div>

        <Button
          variant={completed ? 'default' : 'outline'}
          onClick={() => setDone(toggleDone(slug))}
        >
          {completed ? (
            <span className='inline-flex items-center gap-2'>
              <Check className='h-4 w-4' />
              Completed
            </span>
          ) : (
            'Mark as done'
          )}
        </Button>
      </div>

      <div className='flex items-center justify-between gap-3'>
        {prev ? (
          <Link href={prev.href}>
            <Button variant='outline'>← {prev.title}</Button>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link href={next.href}>
            <Button>Next: {next.title} →</Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
