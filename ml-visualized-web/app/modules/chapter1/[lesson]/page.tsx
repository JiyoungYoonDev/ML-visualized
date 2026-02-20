import { redirect } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getAllLessons,
  getLessonBySlug,
  getSlugs,
  hasLessonIntroduction,
} from '@/lib/content';
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
import { DecisionBoundaryPlot} from '@/components/lesson/simulators/DecisionBoundaryPlot';
const Paragraph = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
} & Record<string, unknown>) => {
  return <span {...props}>{children}</span>;
};
export async function generateStaticParams() {
  const lessons = await getSlugs('chapter1');
  return lessons.map((lesson) => ({ lesson }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson } = await params;

  if (await hasLessonIntroduction('chapter1', lesson)) {
    redirect(`/modules/chapter1/${lesson}/introduction`);
  }

  const { meta, content } = await getLessonBySlug('chapter1', lesson);

  const all = await getAllLessons('chapter1');
  const idx = all.findIndex((x) => x.slug === lesson);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

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
                DecisionBoundaryPlot
              }}
            />
          </div>
        </article>
      </div>

      <LessonFooter
        chapter='chapter1'
        slug={lesson}
        prev={
          prev
            ? { title: prev.title, href: `/modules/chapter1/${prev.slug}` }
            : undefined
        }
        next={
          next
            ? { title: next.title, href: `/modules/chapter1/${next.slug}` }
            : undefined
        }
      />
    </main>
  );
}
