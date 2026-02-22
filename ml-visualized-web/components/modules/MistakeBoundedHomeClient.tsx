'use client';

import { useState } from 'react';
import Link from 'next/link';

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
import { PageContainer } from '@/components/modules/common/PageContainer';
import { SectionBox } from '@/components/modules/common/SectionBox';

const lessons = [
  {
    title: 'Intro: What is mistake-bounded learning?',
    desc: 'Online learning setup, notation (M vs m), and why mistake bounds matter.',
    href: '/modules/machine-learning/mistake-bounded/intro',
    tag: 'Start here',
  },
  {
    title: 'Weighted Majority',
    desc: 'Combine expert advice with weights. See how mistakes shrink total weight W.',
    href: '/modules/machine-learning/mistake-bounded/weighted-majority',
    tag: 'Core',
  },
  {
    title: 'Monotone Disjunction (Elimination)',
    desc: 'Simple mistake bound example: remove features on negative mistakes.',
    href: '/modules/machine-learning/mistake-bounded/monotone-disjunction',
    tag: 'Soon',
    disabled: true,
  },
];

export default function MistakeBoundedHomeClient() {
  const [showTarget, setShowTarget] = useState(false);

  return (
    <PageContainer>
      <SectionBox>
        <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          Chapter 1 · On-line Learning
        </p>
        <h1 className='mt-2 text-3xl font-bold tracking-tight md:text-4xl'>
          Mistake-Bounded Learning
        </h1>
        <p className='mt-4 text-sm leading-7 text-muted-foreground md:text-base'>
          Learn how an algorithm can make predictions sequentially and still
          guarantee a bounded number of total mistakes compared to the best
          concept or expert in hindsight.
        </p>

        <div className='mt-6 grid gap-3 sm:grid-cols-3'>
          <div className='rounded-lg border bg-muted/40 p-3'>
            <p className='text-xs text-muted-foreground'>Lesson Type</p>
            <p className='mt-1 text-sm font-semibold'>Concept + Interactive</p>
          </div>
          <div className='rounded-lg border bg-muted/40 p-3'>
            <p className='text-xs text-muted-foreground'>Core Goal</p>
            <p className='mt-1 text-sm font-semibold'>Minimize mistakes</p>
          </div>
          <div className='rounded-lg border bg-muted/40 p-3'>
            <p className='text-xs text-muted-foreground'>Setting</p>
            <p className='mt-1 text-sm font-semibold'>Adversarial sequence</p>
          </div>
        </div>
      </SectionBox>

      <SectionBox>
        <h2 className='text-xl font-semibold'>Roadmap</h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          Start with Intro, then move to Weighted Majority.
        </p>

        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          {lessons.map((l) => (
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
              <p className='mt-2 text-sm text-muted-foreground'>{l.desc}</p>
            </Link>
          ))}
        </div>

        <div className='mt-5 flex flex-wrap gap-2'>
          <Link href='/modules/machine-learning/mistake-bounded/intro'>
            <Button>Start here (Intro)</Button>
          </Link>
        </div>
      </SectionBox>

      <SectionBox>
        <h2 className='text-xl font-semibold'>Learning Objectives</h2>
        <ul className='mt-4 space-y-2 text-sm leading-6 text-muted-foreground'>
          <li>Understand what a mistake bound means in on-line learning.</li>
          <li>
            See why we compare learner mistakes M to best-expert mistakes m.
          </li>
          <li>Build intuition using expert advice + weight updates.</li>
        </ul>
      </SectionBox>

      <SectionBox>
        <h2 className='text-xl font-semibold'>Predicting from Expert Advice</h2>
        <p className='mt-3 text-sm leading-7 text-muted-foreground'>
          In each round t, experts provide predictions, the learner predicts,
          then the true label is revealed.
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
            </div>
          </TabsContent>

          <TabsContent value='bound' className='mt-4'>
            <div className='rounded-lg border p-4 text-sm leading-7 text-muted-foreground'>
              We compare learner mistakes <LatexMath math={'M'} /> with best
              expert mistakes <LatexMath math={'m'} />.
            </div>
          </TabsContent>
        </Tabs>
      </SectionBox>

      <SectionBox>
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
                  expert index (<LatexMath math={'i=1,\\dots,n'} />)
                </p>
                <p>
                  <span className='font-semibold text-foreground'>t</span>:
                  round/time step (<LatexMath math={'t=1,\\dots,T'} />)
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
        </Accordion>
      </SectionBox>
    </PageContainer>
  );
}
