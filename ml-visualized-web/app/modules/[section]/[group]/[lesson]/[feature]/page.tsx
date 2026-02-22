import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ReactNode } from 'react';
import {
  getAllLessons,
  getLessonBySlug,
  getLessonFeatureBySlug,
  getLessonFeatures,
  hasLessonIntroduction,
} from '@/lib/content';
import { featurePathFromMeta, toPathSegment } from '@/lib/content/paths';
import {
  findModuleLessonEntryByRoute,
  getAllModuleLessonEntries,
} from '@/lib/content/modules-catalog';
import { toGroupLabel } from '@/lib/content/labels';
import LessonFooter from '@/components/lesson/LessonFooter';

import { LatexMath } from '@/components/latex-math';
import { QuizBlock } from '@/components/lesson/QuizBlock';
import { Simulator } from '@/components/lesson/simulator';
import { Block } from '@/components/lesson/Block';
import { Font } from '@/components/lesson/font';
import { LearningOutcomes } from '@/components/lesson/LearningOutcomes';
import { OnThisPageToc } from '@/components/lesson/OnThisPageToc';
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
import { SectionSeparator } from '@/components/lesson/SectionSeparator';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SigmoidClampDemo } from '@/components/lesson/simulators/SigmoidClampDemo';
import { DecisionBoundaryPlot } from '@/components/lesson/simulators/DecisionBoundaryPlot';
import GraphPlot from '@/components/lesson/simulators/GraphPlot';

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type MdxBlockProps = {
  label?: string;
  title?: string;
  description?: string;
  className?: string;
  bordered?: boolean;
  divider?: boolean;
  children?: ReactNode;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeHeadingText(value: string): string {
  return value
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function extractTocItems(source: string): TocItem[] {
  const seen = new Map<string, number>();
  const items: TocItem[] = [];
  const lines = source.split('\n');
  let inBlockTag = false;

  for (const line of lines) {
    if (!inBlockTag && line.includes('<Block')) {
      inBlockTag = true;
    }

    if (inBlockTag) {
      const blockTitleMatch = line.match(/title\s*=\s*['\"](.+?)['\"]/);
      if (blockTitleMatch) {
        const text = normalizeHeadingText(blockTitleMatch[1]);
        const baseId = slugify(text);

        if (text && baseId) {
          const count = seen.get(baseId) ?? 0;
          seen.set(baseId, count + 1);
          const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
          items.push({ id, text, level: 2 });
        }
      }

      if (line.includes('>')) {
        inBlockTag = false;
      }
    }

    const match = line.match(/^(##|###)\s+(.+)$/);
    if (!match) continue;

    const level = match[1] === '##' ? 2 : 3;
    const text = normalizeHeadingText(match[2]);
    if (!text) continue;

    const baseId = slugify(text);
    if (!baseId) continue;

    const count = seen.get(baseId) ?? 0;
    seen.set(baseId, count + 1);
    const id = count === 0 ? baseId : `${baseId}-${count + 1}`;

    items.push({ id, text, level });
  }

  return items;
}

function plainTextFromNode(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(plainTextFromNode).join(' ');
  if (typeof node === 'object' && 'props' in node) {
    const element = node as { props?: { children?: ReactNode } };
    return plainTextFromNode(element.props?.children);
  }
  return '';
}

const Paragraph = ({
  children,
  ...props
}: { children?: ReactNode } & Record<string, unknown>) => {
  return <span {...props}>{children}</span>;
};

function normalizeLinearFeatureSlug(raw: string) {
  return raw.toLowerCase().trim();
}

async function resolveLinearFeatureSlug(rawFeature: string) {
  const lessons = await getAllLessons('linear_algebra');
  const normalized = normalizeLinearFeatureSlug(rawFeature);

  const candidates = [
    normalized,
    normalized.replace(/-/g, '_'),
    normalized.replace(/_/g, '-'),
  ];

  const match = lessons.find((item) => candidates.includes(item.slug));
  return { lessons, match };
}

export async function generateStaticParams() {
  const params: Array<{
    section: string;
    group: string;
    lesson: string;
    feature: string;
  }> = [];

  const moduleEntries = await getAllModuleLessonEntries();
  const nonLinearEntries = moduleEntries.filter(
    (entry) => entry.chapterKey !== 'linear_algebra',
  );

  for (const { chapterKey, lesson } of nonLinearEntries) {
    const section = toPathSegment(lesson.section);
    const group = toPathSegment(lesson.group ?? lesson.section);
    if (!group) continue;

    const features = await getLessonFeatures(chapterKey, lesson.slug);
    for (const feature of features) {
      params.push({
        section,
        group,
        lesson: lesson.slug,
        feature: feature.slug,
      });
    }
  }

  const linearLessons = await getAllLessons('linear_algebra');
  for (const linear of linearLessons) {
    params.push({
      section: 'linear-algebra',
      group: 'linear-algebra',
      lesson: 'eigen',
      feature: linear.slug,
    });
  }

  return params;
}

export default async function CanonicalFeaturePage({
  params,
}: {
  params: Promise<{
    section: string;
    group: string;
    lesson: string;
    feature: string;
  }>;
}) {
  const { section, group, lesson, feature } = await params;

  if (
    section === 'linear-algebra' &&
    group === 'linear-algebra' &&
    lesson === 'eigen'
  ) {
    if (feature === 'introduction') {
      redirect('/modules/linear-algebra/overview');
    }

    const { lessons: linearLessons, match } =
      await resolveLinearFeatureSlug(feature);
    if (!match) notFound();

    const lessonDoc = await getLessonBySlug('linear_algebra', match.slug);
    const sorted = linearLessons
      .slice()
      .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));

    const currentIndex = sorted.findIndex((item) => item.slug === match.slug);
    const prev = currentIndex > 0 ? sorted[currentIndex - 1] : undefined;
    const next =
      currentIndex >= 0 && currentIndex < sorted.length - 1
        ? sorted[currentIndex + 1]
        : undefined;
    const pathLabel = toGroupLabel(group);

    return (
      <main className='mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10'>
        <section className='rounded-2xl border bg-card p-6 md:p-10'>
          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            {pathLabel} · {String(lessonDoc.meta.title ?? match.slug)}
          </p>

          <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
            {String(lessonDoc.meta.title ?? match.slug)}
          </h1>

          {lessonDoc.meta.summary && (
            <p className='mt-3 text-sm leading-7 text-muted-foreground'>
              {String(lessonDoc.meta.summary)}
            </p>
          )}
        </section>

        <div className='mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]'>
          <article className='rounded-2xl border bg-card p-5 md:p-8'>
            <div className='prose prose-zinc dark:prose-invert max-w-none'>
              <MDXRemote
                source={lessonDoc.content}
                components={{
                  LatexMath,
                  QuizBlock,
                  Simulator,
                  Block,
                  LearningOutcomes,
                }}
              />
            </div>
          </article>
        </div>

        <LessonFooter
          chapter={pathLabel}
          slug={match.slug}
          prev={
            prev
              ? {
                  title: prev.title,
                  href: `/modules/linear-algebra/${prev.slug}`,
                }
              : undefined
          }
          next={
            next
              ? {
                  title: next.title,
                  href: `/modules/linear-algebra/${next.slug}`,
                }
              : undefined
          }
        />
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

  if (!(await hasLessonIntroduction(chapterKey, lesson))) {
    notFound();
  }

  const [lessonDoc, featureDoc, features] = await Promise.all([
    getLessonBySlug(chapterKey, lesson),
    getLessonFeatureBySlug(chapterKey, lesson, feature),
    getLessonFeatures(chapterKey, lesson),
  ]);

  const activeFeature = features.find((item) => item.slug === feature);
  if (!activeFeature) {
    notFound();
  }

  const featureIdx = features.findIndex((item) => item.slug === feature);
  const prevFeature = featureIdx > 0 ? features[featureIdx - 1] : undefined;
  const nextFeature =
    featureIdx >= 0 && featureIdx < features.length - 1
      ? features[featureIdx + 1]
      : undefined;
  const pathLabel = toGroupLabel(target.group ?? target.section);
  const tocItems = extractTocItems(featureDoc.content);

  const headingIdState = new Map<string, number>();

  const createHeadingId = (text: string) => {
    const baseId = slugify(normalizeHeadingText(text));
    if (!baseId) return '';

    const count = headingIdState.get(baseId) ?? 0;
    headingIdState.set(baseId, count + 1);

    return count === 0 ? baseId : `${baseId}-${count + 1}`;
  };

  const Heading2 = ({ children }: { children?: ReactNode }) => {
    const text = plainTextFromNode(children).trim();
    const id = createHeadingId(text);
    return (
      <h2 id={id} className='scroll-mt-28'>
        {children}
      </h2>
    );
  };

  const Heading3 = ({ children }: { children?: ReactNode }) => {
    const text = plainTextFromNode(children).trim();
    const id = createHeadingId(text);
    return (
      <h3 id={id} className='scroll-mt-28'>
        {children}
      </h3>
    );
  };

  const BlockWithAnchor = ({ title, children, ...rest }: MdxBlockProps) => {
    const titleText = typeof title === 'string' ? title.trim() : '';
    const titleId = titleText ? createHeadingId(titleText) : undefined;

    return (
      <Block title={title} titleId={titleId} {...rest}>
        {children ?? null}
      </Block>
    );
  };

  return (
    <main className='mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10'>
      <section className='rounded-2xl border bg-card p-6 md:p-10'>
        <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          {pathLabel} · {String(lessonDoc.meta.title ?? lesson)}
        </p>

        <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
          {String(lessonDoc.meta.title ?? lesson)}
        </h1>

        {lessonDoc.meta.summary && (
          <p className='mt-3 text-sm leading-7 text-muted-foreground'>
            {String(lessonDoc.meta.summary)}
          </p>
        )}
      </section>

      <section className='mt-6 rounded-2xl border bg-card p-5 md:p-8'>
        <Tabs value={feature} className='w-full'>
          <TabsList className='inline-flex h-auto w-fit flex-wrap justify-start'>
            {features.map((item) => (
              <TabsTrigger asChild key={item.slug} value={item.slug}>
                <Link href={featurePathFromMeta(lessonDoc.meta, item.slug)}>
                  {item.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>

          <SectionSeparator className='mt-4' />

          <TabsContent value={feature} className='mt-4'>
            <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]'>
              <div className='prose prose-zinc dark:prose-invert max-w-none'>
                <MDXRemote
                  source={featureDoc.content}
                  components={{
                    LatexMath,
                    QuizBlock,
                    Simulator,
                    Block: BlockWithAnchor,
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
                    DecisionBoundaryPlot,
                    GraphPlot,
                    Separator: SectionSeparator,
                    Seperator: SectionSeparator,
                    h2: Heading2,
                    h3: Heading3,
                    p: Paragraph,
                  }}
                />
              </div>
              <OnThisPageToc items={tocItems} />
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <LessonFooter
        chapter={pathLabel}
        slug={lesson}
        prev={
          prevFeature
            ? {
                title: prevFeature.label,
                href: featurePathFromMeta(lessonDoc.meta, prevFeature.slug),
              }
            : undefined
        }
        next={
          nextFeature
            ? {
                title: nextFeature.label,
                href: featurePathFromMeta(lessonDoc.meta, nextFeature.slug),
              }
            : undefined
        }
      />
    </main>
  );
}
