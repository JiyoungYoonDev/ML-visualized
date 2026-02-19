'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getQuizAnswer, setQuizAnswer, setQuizTotal } from '@/lib/progress';

export function QuizBlock({
  question,
  options,
  answerIndex,
  explanation,
}: {
  question: string;
  options?: string[];
  answerIndex: number;
  explanation: string;
}) {
  const pathname = usePathname();
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const safeOptions = options ?? [];
  const correct = selected === answerIndex;
  const lessonSlug = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] ?? 'unknown';
  }, [pathname]);
  const quizId = useMemo(() => {
    return `${lessonSlug}::${question}`;
  }, [lessonSlug, question]);

  useEffect(() => {
    const prev = getQuizAnswer(lessonSlug, quizId);
    if (!prev) return;
    setSelected(prev.selected);
    setSubmitted(true);
  }, [lessonSlug, quizId]);

  useEffect(() => {
    const total = document.querySelectorAll(
      `[data-quiz-lesson="${lessonSlug}"]`,
    ).length;
    if (total > 0) {
      setQuizTotal(lessonSlug, total);
    }
  }, [lessonSlug]);

  return (
    <div className='rounded-2xl border bg-card p-4 space-y-3'>
      <div data-quiz-lesson={lessonSlug} className='hidden' />
      <div className='text-sm font-semibold'>Quick Check</div>
      <div className='text-sm text-muted-foreground'>{question}</div>

      <div className='space-y-2'>
        {safeOptions.map((opt, i) => (
          <button
            key={i}
            type='button'
            onClick={() => {
              setSelected(i);
              setSubmitted(false);
            }}
            className={[
              'w-full text-left rounded-lg border px-3 py-2 text-sm transition',
              selected === i ? 'bg-muted' : 'hover:bg-muted/60',
            ].join(' ')}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className='flex items-center gap-2'>
        <Button
          onClick={() => {
            if (selected === null) return;
            setSubmitted(true);
            setQuizAnswer(
              lessonSlug,
              quizId,
              selected,
              selected === answerIndex,
            );
          }}
          disabled={selected === null}
          variant='outline'
        >
          Check
        </Button>
        {submitted && (
          <div className='text-sm'>
            {correct ? (
              <span className='font-medium'>✅ Correct</span>
            ) : (
              <span className='font-medium'>❌ Not quite</span>
            )}
          </div>
        )}
      </div>

      {submitted && (
        <div className='rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground'>
          {explanation}
        </div>
      )}
    </div>
  );
}
