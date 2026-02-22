import { LatexMath } from '@/components/latex-math';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionBox } from '@/components/modules/common/SectionBox';

export function ExpertAdviceSection() {
  return (
    <SectionBox>
      <h2 className='text-xl font-semibold'>Predicting from Expert Advice</h2>
      <p className='mt-3 text-sm leading-7 text-muted-foreground'>
        (예시) online learning에서는 매 라운드마다 예측 → 정답 공개 → 업데이트를
        반복해.
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
            목표는 <LatexMath math={'M'} />을 <LatexMath math={'m'} />에 가깝게
            유지하는 것. 보통 <LatexMath math={'\\log n'} /> 같은 작은
            overhead가 붙어.
          </div>
        </TabsContent>
      </Tabs>
    </SectionBox>
  );
}
