import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import {
  getAllLessons,
  getLessonBySlug,
  hasLessonIntroduction,
} from '@/lib/content';
import {
  featurePathFromMeta,
  lessonPathFromMeta,
  toPathSegment,
} from '@/lib/content/paths';
import {
  findModuleLessonEntryByRoute,
  getAllModuleLessonEntries,
} from '@/lib/content/modules-catalog';
import LessonFooter from '@/components/lesson/LessonFooter';

import { LatexMath } from '@/components/latex-math';
import { QuizBlock } from '@/components/lesson/QuizBlock';
import { Simulator } from '@/components/lesson/simulator';
import { Block } from '@/components/lesson/Block';
import { Font } from '@/components/lesson/font';
import { LearningOutcomes } from '@/components/lesson/LearningOutcomes';
import {
  PipelineStep,
  PipelineSteps,
} from '@/components/lesson/PipelineThreeSteps';
import { Takeaway, TakeawayItem } from '@/components/lesson/Takeaway';
import {
  ReadingNotation,
  ReadingNotationItem,
} from '@/components/lesson/ReadingNotation';
import {
  NotationGuide,
  NotationGuideItem,
} from '@/components/lesson/NotationGuide';
import {
  WhatIsLectureCard,
  WhatIsLectureCardItem,
  WhatIsLectureCards,
} from '@/components/lesson/WhatIsLectureCards';
import {
  PrerequisiteLink,
  Prerequisites,
} from '@/components/lesson/Prerequisites';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionSeparator } from '@/components/lesson/SectionSeparator';

import { SigmoidClampDemo } from '@/components/lesson/simulators/SigmoidClampDemo';
import { DecisionBoundaryPlot } from '@/components/lesson/simulators/DecisionBoundaryPlot';

const MISTAKE_BOUNDED_DIR = path.join(
  process.cwd(),
  'content',
  'mistake-bounded',
);

const Paragraph = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
} & Record<string, unknown>) => {
  return <span {...props}>{children}</span>;
};

async function getMistakeBoundedLesson(slug: string) {
  try {
    const filePath = path.join(MISTAKE_BOUNDED_DIR, `${slug}.mdx`);
    const raw = await fs.readFile(filePath, 'utf8');
    const { content, data } = matter(raw);
    return { content, data };
  } catch {
    return null;
  }
}

async function getMistakeBoundedLessonsMeta() {
  try {
    const files = await fs.readdir(MISTAKE_BOUNDED_DIR);
    const lessons = await Promise.all(
      files
        .filter((file) => file.endsWith('.mdx'))
        .map(async (file) => {
          const slug = file.replace(/\.mdx$/, '');
          const raw = await fs.readFile(
            path.join(MISTAKE_BOUNDED_DIR, file),
            'utf8',
          );
          const { data } = matter(raw);

          return {
            slug,
            title: String(data?.title ?? slug),
            summary: data?.summary ? String(data.summary) : '',
            order: Number(data?.order ?? 999),
          };
        }),
    );

    return lessons.sort((a, b) => a.order - b.order);
  } catch {
    return [] as Array<{
      slug: string;
      title: string;
      summary: string;
      order: number;
    }>;
  }
}

async function getMistakeBoundedSlugs() {
  try {
    const files = await fs.readdir(MISTAKE_BOUNDED_DIR);
    return files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''));
  } catch {
    return [] as string[];
  }
}

export async function generateStaticParams() {
  const moduleEntries = await getAllModuleLessonEntries();
  const moduleParams = moduleEntries.map(({ lesson }) => ({
    section: toPathSegment(lesson.section),
    group: toPathSegment(lesson.group ?? lesson.section),
    lesson: lesson.slug,
  }));

  const mistakeBoundedSlugs = await getMistakeBoundedSlugs();
  const mistakeParams = mistakeBoundedSlugs.map((slug) => ({
    section: 'machine-learning',
    group: 'mistake-bounded',
    lesson: slug,
  }));

  return [
    ...moduleParams,
    { section: 'linear-algebra', group: 'linear-algebra', lesson: 'eigen' },
    ...mistakeParams,
  ];
}

export default async function CanonicalLessonPage({
  params,
}: {
  params: Promise<{ section: string; group: string; lesson: string }>;
}) {
  const { section, group, lesson } = await params;

  if (
    section === 'linear-algebra' &&
    group === 'linear-algebra' &&
    lesson === 'eigen'
  ) {
    const linearLessons = await getAllLessons('linear_algebra');
    const first = linearLessons
      .slice()
      .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))[0];

    if (!first) notFound();

    redirect(`/modules/linear-algebra/${first.slug}`);
  }

  if (section === 'machine-learning' && group === 'mistake-bounded') {
    const [mistakeLesson, mistakeLessons] = await Promise.all([
      getMistakeBoundedLesson(lesson),
      getMistakeBoundedLessonsMeta(),
    ]);

    if (!mistakeLesson) notFound();

    const currentIndex = mistakeLessons.findIndex(
      (item) => item.slug === lesson,
    );
    const prevLesson =
      currentIndex > 0 ? mistakeLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex >= 0 && currentIndex < mistakeLessons.length - 1
        ? mistakeLessons[currentIndex + 1]
        : null;

    return (
      <main className='mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10'>
        <div className='grid gap-6 lg:grid-cols-12'>
          <div className='space-y-6 lg:col-span-8'>
            <section className='rounded-2xl border bg-card p-6 md:p-8'>
              <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                Mistake-Bounded · Lesson{' '}
                {currentIndex >= 0 ? currentIndex + 1 : '-'}
              </p>
              <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
                {String(mistakeLesson.data?.title ?? lesson)}
              </h1>
              {mistakeLesson.data?.summary && (
                <p className='mt-3 text-sm leading-7 text-muted-foreground md:text-base'>
                  {String(mistakeLesson.data.summary)}
                </p>
              )}
            </section>

            <section className='rounded-2xl border bg-card p-5 md:p-8'>
              <article className='prose prose-zinc dark:prose-invert max-w-none prose-headings:tracking-tight prose-h1:mb-4 prose-h2:mt-8 prose-h2:mb-3 prose-p:leading-7 prose-li:my-1'>
                <MDXRemote
                  source={mistakeLesson.content}
                  components={{
                    Math: LatexMath,
                    LatexMath,
                    Simulator,
                    QuizBlock,
                  }}
                />
              </article>
            </section>

            <section className='rounded-2xl border bg-card p-4 md:p-5'>
              <div className='grid gap-3 sm:grid-cols-2'>
                <Link
                  href={
                    prevLesson
                      ? `/modules/machine-learning/mistake-bounded/${prevLesson.slug}`
                      : '/modules/machine-learning/mistake-bounded/intro'
                  }
                  className='rounded-lg border px-4 py-3 text-sm hover:bg-muted/50'
                >
                  <div className='text-xs text-muted-foreground'>Previous</div>
                  <div className='mt-1 font-medium'>
                    {prevLesson ? prevLesson.title : 'Back to overview'}
                  </div>
                </Link>

                <Link
                  href={
                    nextLesson
                      ? `/modules/machine-learning/mistake-bounded/${nextLesson.slug}`
                      : '/modules/machine-learning/mistake-bounded/intro'
                  }
                  className='rounded-lg border px-4 py-3 text-sm hover:bg-muted/50'
                >
                  <div className='text-xs text-muted-foreground'>Next</div>
                  <div className='mt-1 font-medium'>
                    {nextLesson ? nextLesson.title : 'Back to overview'}
                  </div>
                </Link>
              </div>
            </section>
          </div>

          <aside className='lg:col-span-4'>
            <section className='rounded-2xl border bg-card p-5 lg:sticky lg:top-6'>
              <h2 className='text-base font-semibold'>Lesson Path</h2>
              <p className='mt-1 text-sm text-muted-foreground'>
                Follow lessons in order, like a guided track.
              </p>

              <div className='mt-4 space-y-2'>
                {mistakeLessons.map((item, index) => {
                  const isActive = item.slug === lesson;

                  return (
                    <Link
                      key={item.slug}
                      href={`/modules/machine-learning/mistake-bounded/${item.slug}`}
                      className={[
                        'block rounded-lg border px-3 py-3 transition',
                        isActive
                          ? 'border-foreground bg-muted'
                          : 'hover:bg-muted/50',
                      ].join(' ')}
                    >
                      <div className='text-xs text-muted-foreground'>
                        Lesson {index + 1}
                      </div>
                      <div className='mt-1 text-sm font-medium'>
                        {item.title}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </main>
    );
  }

  const entry = await findModuleLessonEntryByRoute({
    section,
    group,
    lesson,
  });
  if (!entry) notFound();

  const chapterKey = entry.chapterKey;
  const lessons = await getAllLessons(chapterKey);
  const target = lessons.find((item) => item.slug === lesson);

  if (!target) notFound();

  const sectionOk = toPathSegment(target.section) === section;
  const groupOk = toPathSegment(target.group ?? target.section) === group;

  if (!sectionOk || !groupOk) notFound();

  const { meta, content } = await getLessonBySlug(chapterKey, lesson);

  if (await hasLessonIntroduction(chapterKey, lesson)) {
    redirect(featurePathFromMeta(meta, 'introduction'));
  }

  const idx = lessons.findIndex((x) => x.slug === lesson);
  const prev = idx > 0 ? lessons[idx - 1] : undefined;
  const next =
    idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : undefined;

  return (
    <main className='mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10'>
      <section className='rounded-2xl border bg-card p-6 md:p-10'>
        <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          {String(meta.chapter ?? 'Chapter')} ·{' '}
          {String(meta.section ?? 'Lesson')}
        </p>

        <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
          {String(meta.title ?? lesson)}
        </h1>

        {meta.summary && (
          <p className='mt-3 text-sm leading-7 text-muted-foreground'>
            {String(meta.summary)}
          </p>
        )}
      </section>

      <div className='mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]'>
        <article className='rounded-2xl border bg-card p-5 md:p-8'>
          <div className='prose prose-zinc dark:prose-invert max-w-none'>
            <MDXRemote
              source={content}
              components={{
                LatexMath,
                QuizBlock,
                Simulator,
                Block,
                Font,
                LearningOutcomes,
                PipelineSteps,
                PipelineStep,
                Takeaway,
                TakeawayItem,
                ReadingNotation,
                ReadingNotationItem,
                NotationGuide,
                NotationGuideItem,
                WhatIsLectureCards,
                WhatIsLectureCard,
                WhatIsLectureCardItem,
                Prerequisites,
                PrerequisiteLink,
                Accordion,
                AccordionItem,
                AccordionTrigger,
                AccordionContent,
                SigmoidClampDemo,
                Separator: SectionSeparator,
                Seperator: SectionSeparator,
                p: Paragraph,
                DecisionBoundaryPlot,
              }}
            />
          </div>
        </article>
      </div>

      <LessonFooter
        chapter={chapterKey}
        slug={lesson}
        prev={
          prev
            ? { title: prev.title, href: lessonPathFromMeta(prev) }
            : undefined
        }
        next={
          next
            ? { title: next.title, href: lessonPathFromMeta(next) }
            : undefined
        }
      />
    </main>
  );
}
