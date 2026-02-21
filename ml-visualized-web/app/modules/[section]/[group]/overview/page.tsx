import Link from 'next/link';
import { notFound } from 'next/navigation';
import MistakeBoundedHomeClient from '@/components/modules/MistakeBoundedHomeClient';
import { getAllModuleLessons } from '@/lib/content/modules-catalog';
import { lessonPathFromMeta, toPathSegment } from '@/lib/content/paths';

type LessonCard = {
  slug: string;
  title: string;
  summary?: string;
  href: string;
  order?: number;
};

function titleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function GroupOverviewPage({
  params,
}: {
  params: Promise<{ section: string; group: string }>;
}) {
  const { section, group } = await params;

  if (section === 'lectures' && group === 'mistake-bounded') {
    return <MistakeBoundedHomeClient />;
  }

  const moduleLessons = await getAllModuleLessons();
  const lessons: LessonCard[] = moduleLessons
    .filter(
      (lesson) =>
        toPathSegment(lesson.section) === section &&
        toPathSegment(lesson.group ?? lesson.section) === group,
    )
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    .map((lesson) => ({
      slug: lesson.slug,
      title: lesson.navLabel ?? lesson.title,
      summary: lesson.summary,
      order: lesson.order,
      href: lessonPathFromMeta(lesson),
    }));

  if (lessons.length === 0) {
    notFound();
  }

  const first = lessons[0];

  return (
    <main className='mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10 space-y-6'>
      <section className='rounded-2xl border bg-card p-6 md:p-8'>
        <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          Module Overview
        </p>
        <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
          {titleCase(group)}
        </h1>
        <p className='mt-3 text-sm text-muted-foreground'>
          이 그룹의 학습 개요입니다. 아래 순서대로 lesson을 진행하세요.
        </p>
        <div className='mt-5'>
          <Link
            href={first.href}
            className='inline-flex rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted/50'
          >
            Start with {first.title}
          </Link>
        </div>
      </section>

      <section className='rounded-2xl border bg-card p-6 md:p-8'>
        <h2 className='text-xl font-semibold'>Lessons</h2>
        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          {lessons.map((lesson, index) => (
            <Link
              key={lesson.href}
              href={lesson.href}
              className='rounded-xl border p-4 transition hover:bg-muted/40'
            >
              <p className='text-xs text-muted-foreground'>
                Lesson {index + 1}
              </p>
              <p className='mt-1 font-semibold'>{lesson.title}</p>
              {lesson.summary && (
                <p className='mt-2 text-sm text-muted-foreground'>
                  {lesson.summary}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
