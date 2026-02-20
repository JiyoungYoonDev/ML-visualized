import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

import { LatexMath } from '../../../../components/latex-math';
import { Simulator } from '../../../../components/lesson/simulator';
import { QuizBlock } from '../../../../components/lesson/QuizBlock';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'mistake-bounded');

async function getLesson(slug: string | undefined) {
  if (!slug) throw new Error('Slug is missing. Check route params.');
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { content, data } = matter(raw);
  return { content, data };
}

async function getLessonsMeta() {
  const files = await fs.readdir(CONTENT_DIR);
  const lessons = await Promise.all(
    files
      .filter((f) => f.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, '');
        const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf8');
        const { data } = matter(raw);

        return {
          slug,
          title: String(data?.title ?? slug),
          summary: data?.summary ? String(data.summary) : '',
          order: Number(data?.order ?? 999),
        };
      })
  );

  return lessons.sort((a, b) => a.order - b.order);
}

async function getAllSlugs() {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    return files
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''));
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function MistakeBoundedLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ content, data }, lessons] = await Promise.all([
    getLesson(slug),
    getLessonsMeta(),
  ]);

  const currentIndex = lessons.findIndex((lesson) => lesson.slug === slug);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  return (
    <main className='mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10'>
      <div className='grid gap-6 lg:grid-cols-12'>
        <div className='space-y-6 lg:col-span-8'>
          <section className='rounded-2xl border bg-card p-6 md:p-8'>
            <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              Mistake-Bounded · Lesson {currentIndex >= 0 ? currentIndex + 1 : '-'}
            </p>
            <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
              {String(data?.title ?? slug)}
            </h1>
            {data?.summary && (
              <p className='mt-3 text-sm leading-7 text-muted-foreground md:text-base'>
                {String(data.summary)}
              </p>
            )}
          </section>

          <section className='rounded-2xl border bg-card p-5 md:p-8'>
            <article className='prose prose-zinc dark:prose-invert max-w-none prose-headings:tracking-tight prose-h1:mb-4 prose-h2:mt-8 prose-h2:mb-3 prose-p:leading-7 prose-li:my-1'>
              <MDXRemote
                source={content}
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
                    ? `/modules/mistake-bounded/${prevLesson.slug}`
                    : '/modules/mistake-bounded'
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
                    ? `/modules/mistake-bounded/${nextLesson.slug}`
                    : '/modules/mistake-bounded'
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
              {lessons.map((lesson, index) => {
                const isActive = lesson.slug === slug;

                return (
                  <Link
                    key={lesson.slug}
                    href={`/modules/mistake-bounded/${lesson.slug}`}
                    className={[
                      'block rounded-lg border px-3 py-3 transition',
                      isActive ? 'border-foreground bg-muted' : 'hover:bg-muted/50',
                    ].join(' ')}
                  >
                    <div className='text-xs text-muted-foreground'>
                      Lesson {index + 1}
                    </div>
                    <div className='mt-1 text-sm font-medium'>{lesson.title}</div>
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
