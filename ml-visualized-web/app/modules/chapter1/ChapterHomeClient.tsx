'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LatexMath } from '@/components/latex-math';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type LessonMeta = {
  slug: string;
  title: string;
  summary?: string;
  order?: number;
  section?: string; // e.g. Bootcamps / Lectures / Drills
};

type SectionGroup = {
  section: string;
  items: LessonMeta[];
};

export default function Chapter1HomeClient({
  sections,
  first,
}: {
  sections: SectionGroup[];
  first: LessonMeta | null;
}) {
  const [showTarget, setShowTarget] = useState(false);

  // Roadmap: "Start here"로 보일 것들 몇 개만 뽑고 싶으면 여기서 필터/슬라이스
  // 지금은 Lectures 섹션의 앞 3개를 roadmap으로 보여주는 방식
  const lectures = sections.find((s) => s.section === 'Lectures')?.items ?? [];
  const roadmap = lectures.slice(0, 3).map((l, idx) => ({
    title: l.title,
    desc: l.summary ?? '',
    href: `/modules/chapter1/${l.slug}`,
    tag: idx === 0 ? 'Start here' : idx === 1 ? 'Core' : 'Next',
    disabled: false,
  }));

  return (
    <main className='mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10 space-y-6'>
      {/* Hero */}
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
            <Link href={`/modules/chapter1/${first.slug}`}>
              <Button>Start</Button>
            </Link>
          )}

          <Link href='/modules/chapter1/notation-bootcamp'>
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

      {/* Roadmap (MDX 기반 자동) */}
      <section className='rounded-2xl border bg-card p-6 md:p-8'>
        <h2 className='text-xl font-semibold'>Roadmap</h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          아래 순서대로 따라가면 HW1 문제를 풀기 위한 기본 흐름이 잡혀.
        </p>

        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          {roadmap.map((l) => (
            <Link
              key={l.href}
              href={l.disabled ? '#' : l.href}
              aria-disabled={!!l.disabled}
              onClick={(e) => {
                if (l.disabled) e.preventDefault();
              }}
              className={[
                'rounded-xl border p-4 transition',
                l.disabled
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:bg-muted/40',
              ].join(' ')}
            >
              <div className='flex items-center justify-between gap-2'>
                <div className='font-semibold'>{l.title}</div>
                <span className='text-xs rounded-full border px-2 py-0.5 text-muted-foreground'>
                  {l.tag}
                </span>
              </div>
              {!!l.desc && (
                <p className='mt-2 text-sm text-muted-foreground'>{l.desc}</p>
              )}
            </Link>
          ))}
        </div>

        <div className='mt-5 flex flex-wrap gap-2'>
          {first && (
            <Link href={`/modules/chapter1/${first.slug}`}>
              <Button>Start here</Button>
            </Link>
          )}
          <Link href='/modules/chapter1/drills'>
            <Button variant='outline'>Open drills</Button>
          </Link>
        </div>
      </section>

      {/* 너 스타일 유지: Expert advice tabs */}
      <section className='rounded-2xl border bg-card p-6 md:p-8'>
        <h2 className='text-xl font-semibold'>Predicting from Expert Advice</h2>
        <p className='mt-3 text-sm leading-7 text-muted-foreground'>
          (예시) online learning에서는 매 라운드마다 예측 → 정답 공개 →
          업데이트를 반복해.
        </p>

        <Tabs defaultValue='flow' className='mt-5 w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='flow'>Round Flow</TabsTrigger>
            <TabsTrigger value='bound'>Mistake Bound</TabsTrigger>
          </TabsList>

          <TabsContent value='flow' className='mt-4 space-y-3'>
            <div className='rounded-lg border p-4 text-sm text-muted-foreground'>
              <p>Expert predictions:</p>
              <p className='mt-1 text-foreground'>
                <LatexMath math={'x_i(t) \\in \\{0,1\\}'} />
              </p>

              <p className='mt-3'>Learner prediction:</p>
              <p className='mt-1 text-foreground'>
                <LatexMath math={'\\hat{y}(t) \\in \\{0,1\\}'} />
              </p>

              <p className='mt-3'>True label revealed:</p>
              <p className='mt-1 text-foreground'>
                <LatexMath math={'y(t) \\in \\{0,1\\}'} />
              </p>

              <p className='mt-3 font-medium text-foreground'>
                Mathematical Notation
              </p>
              <p className='mt-1 text-foreground'>
                <LatexMath
                  math={'M = \\sum_{t=1}^T \\mathbb{1}[\\hat{y}(t) \\neq y(t)]'}
                />
              </p>
              <p className='mt-1 text-foreground'>
                <LatexMath
                  math={
                    'm = \\min_{i} \\sum_{t=1}^T \\mathbb{1}[x_i(t) \\neq y(t)]'
                  }
                />
              </p>
            </div>
          </TabsContent>

          <TabsContent value='bound' className='mt-4'>
            <div className='rounded-lg border p-4 text-sm leading-7 text-muted-foreground'>
              목표는 <LatexMath math={'M'} />을 <LatexMath math={'m'} />에
              가깝게 유지하는 것. 보통 <LatexMath math={'\\log n'} /> 같은 작은
              overhead가 붙어.
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className='rounded-2xl border bg-card p-6 md:p-8'>
        <div className='flex items-center justify-between gap-3'>
          <h2 className='text-xl font-semibold'>Deeper Notes</h2>
          <div className='flex items-center gap-3'>
            <Switch checked={showTarget} onCheckedChange={setShowTarget} />
            <span className='text-sm text-muted-foreground'>
              (toggle example: show more detail)
            </span>
          </div>
        </div>

        <Accordion type='single' collapsible className='mt-5'>
          <AccordionItem value='notation'>
            <AccordionTrigger>Notation (기호)</AccordionTrigger>
            <AccordionContent>
              <div className='space-y-3 text-sm leading-7 text-muted-foreground'>
                <p>
                  <span className='font-semibold text-foreground'>i</span>:
                  expert index (
                  <LatexMath math={'i=1,\\dots,n'} />)
                </p>
                <p>
                  <span className='font-semibold text-foreground'>t</span>:
                  round/time step (
                  <LatexMath math={'t=1,\\dots,T'} />)
                </p>

                {showTarget && (
                  <div className='rounded-lg border bg-muted/40 p-3'>
                    <div className='font-semibold text-foreground'>
                      Mistakes
                    </div>
                    <div className='mt-2 space-y-2'>
                      <div>
                        Learner:
                        <LatexMath
                          block
                          math={
                            'M=\\sum_{t=1}^{T}\\mathbb{1}[\\hat{y}(t)\\neq y(t)]'
                          }
                        />
                      </div>
                      <div>
                        Best expert:
                        <LatexMath
                          block
                          math={
                            'm=\\min_{i}\\sum_{t=1}^{T}\\mathbb{1}[x_i(t)\\neq y(t)]'
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='intuition'>
            <AccordionTrigger>Intuition (비유)</AccordionTrigger>
            <AccordionContent>
              <div className='space-y-3 text-sm leading-7 text-muted-foreground'>
                <p>
                  “주위에 n명의 전문가가 있고, 매일 0/1 예측을 한다면 그게{' '}
                  <LatexMath math={'x_i(t)'} />”
                </p>
                <p>
                  우리는 전문가를 똑같이 믿지 않고, 과거 성능에 따라 가중치{' '}
                  <LatexMath math={'w_i(t)'} /> 를 둔다.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 섹션별 Lessons list (MDX 기반 자동) */}
      {sections.map(({ section, items }) => (
        <section
          key={section}
          className='rounded-2xl border bg-card p-6 md:p-8'
        >
          <h2 className='text-xl font-semibold'>{section}</h2>
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            {section !== 'Bootcamps' && items[0] && (
              <Link
                href='/modules/chapter1'
                className='sm:col-span-2 rounded-xl border border-foreground/20 bg-muted/50 p-5 hover:bg-muted/70 transition'
              >
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-2 font-semibold'>
                    <Sparkles className='h-4 w-4 text-muted-foreground' />
                    <span>{items[0].title}</span>
                  </div>
                  <span className='text-xs rounded-full border px-2 py-0.5 text-muted-foreground'>
                    Overview
                  </span>
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {items[0].summary ??
                    'Start this sub-module with a quick overview before diving into each lesson.'}
                </p>
              </Link>
            )}

            {items.slice(1).map((l) => (
              <Link
                key={l.slug}
                href={`/modules/chapter1/${l.slug}`}
                className='rounded-xl border p-4 hover:bg-muted/40 transition'
              >
                <div className='font-semibold'>{l.title}</div>
                {l.summary && (
                  <p className='mt-2 text-sm text-muted-foreground'>
                    {l.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
