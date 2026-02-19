import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getAllLessons, getLessonBySlug, getSlugs } from '@/lib/content';
import LessonFooter from '@/components/lesson/LessonFooter';
import { Button } from '@/components/ui/button';

import { LatexMath } from '@/components/latex-math';
import { QuizBlock } from '@/components/lesson/QuizBlock';
import { Simulator } from '@/components/lesson/simulator';
import { Block } from '@/components/lesson/Block';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export async function generateStaticParams() {
  const slugs = await getSlugs('chapter1');
  return slugs.map((slug) => ({ slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { meta, content } = await getLessonBySlug('chapter1', slug);
  const all = await getAllLessons('chapter1');

  const idx = all.findIndex((x) => x.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  return (
    <main className='mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10'>
      <section className='rounded-2xl border bg-card p-6 md:p-10'>
        <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          Chapter 1 · Lesson
        </p>
        <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
          {meta.title}
        </h1>
        {meta.summary && (
          <p className='mt-3 text-sm leading-7 text-muted-foreground'>
            {meta.summary}
          </p>
        )}

        <div className='mt-5 flex flex-wrap gap-2'>
          <Link href='/modules/chapter1'>
            <Button variant='outline' size='sm'>
              Chapter Overview
            </Button>
          </Link>
          {next && (
            <Link href={`/modules/chapter1/${next.slug}`}>
              <Button size='sm'>Next Lesson</Button>
            </Link>
          )}
        </div>
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
                Accordion,
                AccordionItem,
                AccordionTrigger,
                AccordionContent,
              }}
            />
          </div>
        </article>

        <aside className='hidden lg:block'>
          <div className='sticky top-24 rounded-2xl border bg-card p-4'>
            <p className='text-sm font-semibold'>How to study this page</p>
            <ol className='mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside'>
              <li>Read notation first (`i`, `t`, `M`, `m`).</li>
              <li>Translate each formula into one sentence.</li>
              <li>Solve quizzes before moving to next lesson.</li>
            </ol>
          </div>
        </aside>
      </div>

      <LessonFooter
        chapter='chapter1'
        slug={slug}
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
