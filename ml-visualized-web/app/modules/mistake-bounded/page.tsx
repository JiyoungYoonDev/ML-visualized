'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import { LatexMath } from '../../../components/latex-math';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion';

const lessons = [
  {
    title: 'Intro: What is mistake-bounded learning?',
    desc: 'Online learning setup, notation (M vs m), and why mistake bounds matter.',
    href: '/modules/mistake-bounded/intro',
    tag: 'Start here',
  },
  {
    title: 'Weighted Majority',
    desc: 'Combine expert advice with weights. See how mistakes shrink total weight W.',
    href: '/modules/mistake-bounded/weighted-majority',
    tag: 'Core',
  },
  {
    title: 'Monotone Disjunction (Elimination)',
    desc: 'Simple mistake bound example: remove features on negative mistakes.',
    href: '/modules/mistake-bounded/monotone-disjunction',
    tag: 'Soon',
    disabled: true,
  },
];

export default function MistakeBoundedChapterHome() {
  const [showTarget, setShowTarget] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10 space-y-6">
      {/* Hero */}
      <section className="rounded-2xl border bg-card p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Chapter 1 · On-line Learning
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Mistake-Bounded Learning
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
          Learn how an algorithm can make predictions sequentially and still
          guarantee a bounded number of total mistakes compared to the best
          concept or expert in hindsight.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Lesson Type</p>
            <p className="mt-1 text-sm font-semibold">Concept + Interactive</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Core Goal</p>
            <p className="mt-1 text-sm font-semibold">Minimize mistakes</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Setting</p>
            <p className="mt-1 text-sm font-semibold">Adversarial sequence</p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="rounded-2xl border bg-card p-6 md:p-8">
        <h2 className="text-xl font-semibold">Roadmap</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start with Intro, then move to Weighted Majority. You can play with a
          simulator anytime.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold">{l.title}</div>
                <span className="text-xs rounded-full border px-2 py-0.5 text-muted-foreground">
                  {l.tag}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{l.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/modules/mistake-bounded/intro">
            <Button>Start here (Intro)</Button>
          </Link>
          <Link href="/modules/mistake-bounded/playground">
            <Button variant="outline">Open playground</Button>
          </Link>
        </div>
      </section>

      {/* Learning objectives */}
      <section className="rounded-2xl border bg-card p-6 md:p-8">
        <h2 className="text-xl font-semibold">Learning Objectives</h2>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
          <li>Understand what a mistake bound means in on-line learning.</li>
          <li>See why we compare learner mistakes M to best-expert mistakes m.</li>
          <li>Build intuition using expert advice + weight updates.</li>
        </ul>
      </section>

      {/* Expert advice tabs */}
      <section className="rounded-2xl border bg-card p-6 md:p-8">
        <h2 className="text-xl font-semibold">Predicting from Expert Advice</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          In each round t, experts provide predictions, the learner predicts,
          then the true label is revealed. If wrong → mistake counter increases
          and we update strategy.
        </p>

        <Tabs defaultValue="flow" className="mt-5 w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flow">Round Flow</TabsTrigger>
            <TabsTrigger value="bound">Mistake Bound</TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="mt-4 space-y-3">
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              <p>Expert predictions:</p>
              <p className="mt-1 text-foreground">
                <LatexMath math={'x_i(t) \\in \\{0,1\\}'} />
              </p>

              <p className="mt-3">Learner prediction:</p>
              <p className="mt-1 text-foreground">
                <LatexMath math={'\\hat{y}(t) \\in \\{0,1\\}'} />
              </p>

              <p className="mt-3">True label revealed:</p>
              <p className="mt-1 text-foreground">
                <LatexMath math={'y(t) \\in \\{0,1\\}'} />
              </p>

              <p className="mt-3 font-medium text-foreground">
                Mathematical Notation
              </p>
              <p className="mt-1 text-foreground">
                <LatexMath
                  math={
                    'M = \\sum_{t=1}^T \\mathbb{1}[\\hat{y}(t) \\neq y(t)]'
                  }
                />
              </p>
              <p className="mt-1 text-foreground">
                <LatexMath
                  math={
                    'm = \\min_{i} \\sum_{t=1}^T \\mathbb{1}[x_i(t) \\neq y(t)]'
                  }
                />
              </p>
            </div>
          </TabsContent>

          <TabsContent value="bound" className="mt-4">
            <div className="rounded-lg border p-4 text-sm leading-7 text-muted-foreground">
              We track learner mistakes <LatexMath math={'M'} /> and compare with
              the best expert’s mistakes <LatexMath math={'m'} />. A good
              algorithm keeps <LatexMath math={'M'} /> close to{' '}
              <LatexMath math={'m'} /> plus a small overhead (often like{' '}
              <LatexMath math={'\\log n'} />).
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Accordion section */}
      <section className="rounded-2xl border bg-card p-6 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Deeper Notes</h2>
          <div className="flex items-center gap-3">
            <Switch checked={showTarget} onCheckedChange={setShowTarget} />
            <span className="text-sm text-muted-foreground">
              (toggle example: show more detail)
            </span>
          </div>
        </div>

        <Accordion type="single" collapsible className="mt-5">
          <AccordionItem value="notation">
            <AccordionTrigger>Notation (기호)</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">i</span>:
                  expert index (<LatexMath math={'i=1,\\dots,n'} />)
                </p>
                <p>
                  <span className="font-semibold text-foreground">t</span>:
                  round/time step (<LatexMath math={'t=1,\\dots,T'} />)
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    <LatexMath math={'x_i(t)'} />
                  </span>
                  : expert i prediction at round t, where{' '}
                  <LatexMath math={'x_i(t)\\in\\{0,1\\}'} />.
                </p>
                <p>
                  Learner predicts{' '}
                  <LatexMath math={'\\hat{y}(t)\\in\\{0,1\\}'} /> and then the
                  true label <LatexMath math={'y(t)\\in\\{0,1\\}'} /> is
                  revealed.
                </p>

                {showTarget && (
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <div className="font-semibold text-foreground">Mistakes</div>
                    <div className="mt-2 space-y-2">
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

          <AccordionItem value="intuition">
            <AccordionTrigger>Intuition (비유)</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p>
                  “주위에 n명의 주식 전문가가 있고, 매일(t) 오를지(1)
                  내릴지(0)를 말한다면, 그게 <LatexMath math={'x_i(t)'} />예요.”
                </p>
                <p>
                  우리는 전문가를 똑같이 믿지 않고, 과거 성능에 따라 가중치{' '}
                  <LatexMath math={'w_i(t)'} />를 둡니다.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="wm">
            <AccordionTrigger>Weighted Majority (수식 연결)</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                <p className="font-semibold text-foreground">Weighted vote</p>
                <p>
                  Label 1을 지지하는 “힘”:
                  <span className="ml-2 text-foreground">
                    <LatexMath math={'\\sum_{i: x_i(t)=1} w_i(t)'} />
                  </span>
                </p>
                <p>
                  Label 0을 지지하는 “힘”:
                  <span className="ml-2 text-foreground">
                    <LatexMath math={'\\sum_{i: x_i(t)=0} w_i(t)'} />
                  </span>
                </p>

                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="font-semibold text-foreground">Prediction rule</p>
                  <LatexMath
                    block
                    math={
                      '\\text{Predict 1 if }\\sum_{i:x_i(t)=1}w_i(t)\\ge\\sum_{i:x_i(t)=0}w_i(t)\\text{, else 0.}'
                    }
                  />
                </div>

                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="font-semibold text-foreground">Update</p>
                  <p>
                    정답 <LatexMath math={'y(t)'} />를 보고, 틀린 전문가는 패널티:
                  </p>
                  <LatexMath
                    block
                    math={
                      'w_i(t+1)=\\tfrac{1}{2}w_i(t)\\quad\\text{if }x_i(t)\\ne y(t)'
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Playground preview */}
      <section className="rounded-2xl border bg-card p-6 md:p-8">
        <h2 className="text-xl font-semibold">Interactive Playground</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Try the monotone disjunction teacher. Generate examples and see labels.
        </p>
        <div className="mt-4">
          <Link href="/modules/mistake-bounded/playground">
            <Button>Open playground</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
