import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCustomOverview } from '@/components/modules/custom-overviews';
import { HeroCard } from '@/components/modules/common/HeroCard';
import { PageContainer } from '@/components/modules/common/PageContainer';
import { SectionBox } from '@/components/modules/common/SectionBox';
import LessonFooter from '@/components/lesson/LessonFooter';
import { getAllModuleLessons } from '@/lib/content/modules-catalog';
import { toGroupLabel } from '@/lib/content/labels';
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

  const firstLesson = lessons[0];
  const customOverview = getCustomOverview({
    section,
    group,
    firstLesson,
  });
  if (customOverview) return customOverview;

  if (lessons.length === 0) {
    notFound();
  }

  return (
    <PageContainer>
      <HeroCard
        eyebrow={`${toGroupLabel(group)} · Overview`}
        title={titleCase(group)}
        description={`This is the learning overview for ${titleCase(group)}. I recommend reading them in the following order.`}
      />

      <SectionBox>
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
      </SectionBox>

      <LessonFooter
        chapter={toGroupLabel(group)}
        slug={`${section}-${group}-overview`}
        next={
          firstLesson
            ? {
                title: firstLesson.title,
                href: firstLesson.href,
              }
            : undefined
        }
      />
    </PageContainer>
  );
}
