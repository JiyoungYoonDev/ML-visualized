'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import CodeEditor from '@uiw/react-textarea-code-editor';

interface Props {
  question: string;
  answer: string;
  explanation?: string;
  explanationItems?: string[];
  imageSrc?: string;
  imageAlt?: string;
  code?: string;
  codeBlock?: string;
  className?: string;
  language?: string;
  children?: React.ReactNode;
}

export function InterviewQuestion({
  question,
  answer,
  explanation,
  explanationItems,
  imageSrc,
  imageAlt,
  code,
  codeBlock,
  className,
  language = 'java',
  children,
}: Props) {
  const codeValue =
    typeof code === 'string' && code.trim()
      ? code
      : typeof codeBlock === 'string' && codeBlock.trim()
        ? codeBlock
        : undefined;
  console.log('Rendering InterviewQuestion with code:', codeValue);
  return (
    <div
      className={cn(
        'border-l border-slate-900 bg-white mb-8 shadow-sm',
        className,
      )}
    >
      <div className='p-8'>
        <div className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2'>
          Question 01. OOP Foundations
        </div>
        <h3 className='text-base font-black leading-tight'>"{question}"</h3>
      </div>

      <Accordion type='single' collapsible defaultValue='item-1'>
        <AccordionItem value='item-1' className='border-none'>
          <AccordionTrigger className='px-8 py-4 hover:no-underline group'>
            <span className='text-xs font-black uppercase transition-colors'>
              Solution Analysis
            </span>
          </AccordionTrigger>

          <AccordionContent className='pb-10'>
            <div className='p-6 pl-8 text-sm leading-7 text-slate-700 font-medium'>
              <p>{answer}</p>
            </div>

            <div className='px-8 pl-8 space-y-4'>
              <span className='text-xs font-black uppercase transition-colors'>
                Explanation
              </span>
              {explanation && (
                <div className='text-sm leading-7 text-slate-600 font-medium'>
                  {explanation}
                </div>
              )}
              {explanationItems && explanationItems.length > 0 && (
                <ol className='list-decimal pl-5 text-sm leading-7 text-slate-600 font-medium space-y-1'>
                  {explanationItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
              )}
              {imageSrc && (
                <div className='space-y-4'>
                  <div className='rounded-2xl border border-slate-100 bg-slate-50 p-6 flex items-center justify-center'>
                    <img
                      src={imageSrc}
                      alt='Architecture'
                      className='max-h-64 object-contain'
                    />
                  </div>
                </div>
              )}
              {children && (
                <div className='text-sm leading-7 text-slate-600 font-medium'>
                  {children}
                </div>
              )}
            </div>
            {typeof codeValue === 'string' && codeValue.trim() && (
              <div className='pl-8 space-y-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='text-sm font-black uppercase text-slate-900'>
                    Code Implementation
                  </h4>
                  <span className='text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded uppercase'>
                    {language}
                  </span>
                </div>

                <div className='rounded-sm border border-slate-200 overflow-hidden shadow-inner'>
                  <CodeEditor
                    value={codeValue}
                    language={language}
                    placeholder='No code provided'
                    padding={20}
                    disabled
                    style={{
                      fontSize: 12,
                      backgroundColor: '#f8fafc',
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    }}
                    data-color-mode='light'
                  />
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
