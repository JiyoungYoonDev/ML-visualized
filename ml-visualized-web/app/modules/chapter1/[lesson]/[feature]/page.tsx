import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ReactNode } from 'react';
import {
  getAllLessons,
  getLessonBySlug,
  getLessonFeatureBySlug,
  getLessonFeatures,
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
import { DecisionBoundaryPlot} from '@/components/lesson/simulators/DecisionBoundaryPlot';
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

const Paragraph = ({ children, ...props }: { children?: ReactNode } & Record<string, unknown>) => {
  return <span {...props}>{children}</span>;
};

export async function generateStaticParams() {
  const lessonSlugs = await getSlugs('chapter1');

  const params: Array<{ lesson: string; feature: string }> = [];

  for (const lesson of lessonSlugs) {
    if (!(await hasLessonIntroduction('chapter1', lesson))) continue;

    const features = await getLessonFeatures('chapter1', lesson);
    for (const feature of features) {
      params.push({ lesson, feature: feature.slug });
    }
  }

  return params;
}

export default async function LessonFeaturePage({
  params,
}: {
  params: Promise<{ lesson: string; feature: string }>;
}) {
  const { lesson, feature } = await params;

  if (!(await hasLessonIntroduction('chapter1', lesson))) {
    notFound();
  }

  const [lessonDoc, featureDoc, features, all] = await Promise.all([
    getLessonBySlug('chapter1', lesson),
    getLessonFeatureBySlug('chapter1', lesson, feature),
    getLessonFeatures('chapter1', lesson),
    getAllLessons('chapter1'),
  ]);

  const activeFeature = features.find((item) => item.slug === feature);
  if (!activeFeature) {
    notFound();
  }

  const idx = all.findIndex((x) => x.slug === lesson);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;
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
          {String(lessonDoc.meta.chapter ?? 'Chapter')} ·{' '}
          {String(lessonDoc.meta.section ?? 'Lesson')}
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
                <Link href={`/modules/chapter1/${lesson}/${item.slug}`}>
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
