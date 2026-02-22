'use client';

import { LatexMath } from '../../latex-math';
import { SectionSeparator } from '../../lesson/SectionSeparator';
import { HeroCard } from '../common/HeroCard';
import { IntroCard } from '../common/IntroCard';
import { DiagramSectionCard } from '../common/DiagramSectionCard';
import { PageContainer } from '../common/PageContainer';
import { FinalCard } from '../common/FinalCard';
import { OptimizationContrastGraph } from './OptimizationContrastGraph';
import { motion } from 'framer-motion';
import LessonFooter from '@/components/lesson/LessonFooter';
import { ExplainCard } from '../common/ExplainCard';
import { ConstrainedOptimizationGraph } from './ConstrainedOptimizationGraph';

export default function OptimizationHomeClient({
  nextLesson,
}: {
  nextLesson?: { title: string; href: string };
}) {
  return (
    <PageContainer>
      <HeroCard
        eyebrow='Optimization · Overview'
        title='Optimization'
        description='Greater value with fewer resources: Everything in machine learning ultimately boils down to optimization. This module will give you a deep understanding of the optimization techniques that power machine learning, from the foundational algorithms to the latest advancements.'
      />

      <IntroCard
        title='What is Optimization?'
        description='Optimization is the process of solving an optimization problem, which involves finding the best possible solution to achieve maximum efficiency while minimizing costs or resources'
      >
        <div className='grid gap-4 md:grid-cols-3'>
          {[
            {
              title: 'Objective Function',
              desc: 'The function to be minimized or maximized (e.g., minimizing cost, maximizing accuracy).',
              math: '\\min\\limits_{x \\in D} f(x) \\quad \\text{or} \\quad \\max\\limits_{x \\in D} f(x)',
            },
            {
              title: 'Constraints',
              desc: 'Restrictions applied to the optimization problem (e.g., resource limits, variable ranges).',
              math: 'g_i(x) \\leq b_i \\quad \\forall i',
              color: 'bg-purple-50 text-purple-600 border-purple-100',
            },
            {
              title: 'Decision Variables',
              desc: 'Adjustable variables. These values are tuned to achieve the objective.',
              math: 'x_1, x_2, \\dots, x_n',
              color: 'bg-blue-50 text-blue-600 border-blue-100',
            },
          ].map((item) => (
            <div
              key={item.title}
              className='rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-between'
            >
              <div>
                <h4 className='font-bold text-foreground mb-2'>{item.title}</h4>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  {item.desc}
                </p>
              </div>
              <div className='mt-6 pt-4 border-t border-slate-50 font-mono text-sm'>
                <LatexMath math={item.math} />
              </div>
            </div>
          ))}
        </div>
        <DiagramSectionCard
          title='Standard Mathematical Form'
          description={
            <>
              Most optimization problems in ML are framed as{' '}
              <strong>Minimization Problems</strong>. Even if we want to
              maximize accuracy, we minimize the "Loss."
            </>
          }
          formula={
            <LatexMath
              block
              math='\min_{x} f(x) \quad \text{subject to} \quad g_i(x) \leq 0'
              className='text-white [&_.katex]:text-white'
            />
          }
          diagram={
            <svg
              viewBox='0 0 400 200'
              className='h-full w-full drop-shadow-2xl'
            >
              <defs>
                <linearGradient
                  id='surfaceGradient'
                  x1='0%'
                  y1='0%'
                  x2='0%'
                  y2='100%'
                >
                  <stop offset='0%' stopColor='#3b82f6' stopOpacity='0.2' />
                  <stop offset='100%' stopColor='#3b82f6' stopOpacity='0' />
                </linearGradient>
              </defs>

              <path
                id='curve'
                d='M0,120 C50,120 70,180 120,180 C170,180 200,60 250,60 C300,60 330,180 380,180'
                fill='none'
                stroke='#60a5fa'
                strokeWidth='3'
                className='opacity-80'
              />

              <path
                d='M0,120 C50,120 70,180 120,180 C170,180 200,60 250,60 C300,60 330,180 380,180 V200 H0 Z'
                fill='url(#surfaceGradient)'
              />

              <circle
                cx='120'
                cy='180'
                r='4'
                fill='#f87171'
                className='animate-pulse'
              />
              <text
                x='90'
                y='195'
                fill='#f87171'
                fontSize='10'
                fontWeight='bold'
                className='opacity-70'
              >
                Local Minimum
              </text>

              <circle cx='380' cy='180' r='6' fill='#4ade80' />
              <text
                x='310'
                y='195'
                fill='#4ade80'
                fontSize='10'
                fontWeight='bold'
              >
                Global Minimum
              </text>

              <motion.circle
                r='5'
                fill='#fff'
                animate={{
                  cx: [250, 280, 330, 380],
                  cy: [60, 75, 140, 180],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          }
          note={
            <>
              hidden gem: the area under the curve represents the "search space"
              of possible solutions, and the gradient (slope) at any point
              indicates the direction of steepest ascent/descent.
            </>
          }
        />
        <ExplainCard
          title='Standard Mathematical Form Explanation'
          visual={<ConstrainedOptimizationGraph />}
          visualCaption='Figure 1.1: The feasible region (blue) restricts the objective function, forcing the optimum away from the vertex.'
          description={
            <div className='space-y-4'>
              <p>
                An <strong>optimization problem</strong> consists of an{' '}
                <strong>objective function</strong> that we want to minimize (or
                maximize) subject to certain rules.
              </p>
              <div className='bg-slate-900 p-2 rounded-xl border border-white/10 text-white'>
                <LatexMath
                  block
                  math='\min_{x} f(x) \quad \text{s.t.} \quad f_i(x) \leq 0, \quad i = 1, \dots, m'
                  className='text-white [&_.katex]:text-white'
                />
              </div>
            </div>
          }
          listItems={[
            {
              term: <LatexMath math='f(x)' />,
              description: 'The objective function to minimize.',
            },
            {
              term: <LatexMath math='f_i(x) \leq 0' />,
              description: 'The constraints that must be satisfied.',
            },
            {
              term: <LatexMath math='x^*' />,
              description: (
                <>
                  The <strong>optimal solution (optimum)</strong> that minimizes
                  the function within the allowed space.
                </>
              ),
            },
          ]}
        >
          <div className='mt-6 space-y-4 border-t pt-6'>
            <h3 className='font-bold text-foreground flex items-center gap-2'>
              <span className='h-5 w-5 rounded bg-blue-500 text-white flex items-center justify-center text-[10px]'>
                Ex
              </span>
              Concrete Example Walkthrough
            </h3>

            <div className='bg-muted/50 p-4 rounded-xl border italic'>
              <LatexMath
                block
                math='\min_{x} (x-2)^2 + 1 \quad \text{s.t.} \quad x \leq 1'
              />
            </div>

            <div className='grid gap-4'>
              <div className='rounded-lg border p-3 bg-white'>
                <p className='font-bold text-xs uppercase tracking-wider text-slate-400 mb-1'>
                  1. The Feasible Region
                </p>
                <p className='text-sm'>
                  The constraint <LatexMath math='x-1 \leq 0' /> restricts our
                  search to <LatexMath math='x \leq 1' />. Any value where{' '}
                  <LatexMath math='x > 1' /> is "illegal" and cannot be the
                  solution.
                </p>
              </div>

              <div className='rounded-lg border p-3 bg-white'>
                <p className='font-bold text-xs uppercase tracking-wider text-slate-400 mb-1'>
                  2. Unconstrained vs. Constrained
                </p>
                <p className='text-sm leading-relaxed'>
                  Without the constraint, the minimum is at the vertex{' '}
                  <strong>
                    <LatexMath math='x = 2' />
                  </strong>{' '}
                  (where <LatexMath math='f(2) = 1' />
                  ). However, since <LatexMath math='x=2' /> is outside our
                  allowed region, we must find the lowest point on the curve
                  where <LatexMath math='x \leq 1' />.
                </p>
              </div>

              <div className='rounded-lg border p-3 bg-blue-50 border-blue-100 shadow-sm'>
                <p className='font-bold text-xs uppercase tracking-wider text-blue-500 mb-1'>
                  3. The Final Optimum
                </p>
                <p className='font-medium text-blue-900'>
                  The curve is lowest at the boundary <LatexMath math='x = 1' />
                  . Thus, <LatexMath math='x^* = 1' /> and the minimum value is{' '}
                  <LatexMath math='f(1) = 2' />.
                </p>
              </div>
            </div>
          </div>
        </ExplainCard>

        <OptimizationContrastGraph />

        <FinalCard
          eyebrow='Next'
          title={`Let's discover ${nextLesson?.title ?? 'Convex Set'}`}
          description='Now that you understand the standard form, move to the next lesson and see how convex sets make optimization tractable.'
          ctaLabel={nextLesson ? `Go to ${nextLesson.title}` : undefined}
          ctaHref={nextLesson?.href}
        />
      </IntroCard>

      <LessonFooter
        chapter='optimization'
        slug='optimization-overview'
        next={nextLesson}
      />
    </PageContainer>
  );
}
