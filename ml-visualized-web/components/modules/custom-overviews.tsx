import type { ReactElement } from 'react';
import OptimizationHomeClient from '@/components/modules/optimization/OptimizationHomeClient';

export type OverviewLessonLink = {
  title: string;
  href: string;
};

type CustomOverviewContext = {
  section: string;
  group: string;
  firstLesson?: OverviewLessonLink;
};

type CustomOverviewRenderer = (context: CustomOverviewContext) => ReactElement;

const customOverviewRenderers: Record<string, CustomOverviewRenderer> = {
  'optimization/optimization': ({ firstLesson }) => (
    <OptimizationHomeClient nextLesson={firstLesson} />
  ),
};

export function getCustomOverview(
  context: CustomOverviewContext,
): ReactElement | undefined {
  const key = `${context.section}/${context.group}`;
  return customOverviewRenderers[key]?.(context);
}
