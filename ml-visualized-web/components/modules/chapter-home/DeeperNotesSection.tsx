import { useState } from 'react';
import { LatexMath } from '@/components/latex-math';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function DeeperNotesSection() {
  const [showTarget, setShowTarget] = useState(false);

  return (
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
                <span className='font-semibold text-foreground'>i</span>: expert
                index (
                <LatexMath math={'i=1,\\dots,n'} />)
              </p>
              <p>
                <span className='font-semibold text-foreground'>t</span>:
                round/time step (
                <LatexMath math={'t=1,\\dots,T'} />)
              </p>

              {showTarget && (
                <div className='rounded-lg border bg-muted/40 p-3'>
                  <div className='font-semibold text-foreground'>Mistakes</div>
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
  );
}
