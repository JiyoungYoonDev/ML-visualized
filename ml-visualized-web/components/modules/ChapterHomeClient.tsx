'use client';

import { lessonPathFromMeta } from '@/lib/content/paths';
import { isLecturesSection, toDisplaySectionLabel } from '@/lib/content/labels';
import { ChapterHeroSection } from '@/components/modules/chapter-home/ChapterHeroSection';
import { ChapterRoadmapSection } from '@/components/modules/chapter-home/ChapterRoadmapSection';
import { ExpertAdviceSection } from '@/components/modules/chapter-home/ExpertAdviceSection';
import { DeeperNotesSection } from '@/components/modules/chapter-home/DeeperNotesSection';
import { SectionLessonsGrid } from '@/components/modules/chapter-home/SectionLessonsGrid';
import type {
  LessonMeta,
  SectionGroup,
  RoadmapItem,
} from '@/components/modules/chapter-home/types';

export default function ChapterHomeClient({
  sections,
  first,
}: {
  sections: SectionGroup[];
  first: LessonMeta | null;
}) {
  const normalizedSections = sections.map((sectionGroup) => ({
    ...sectionGroup,
    section: toDisplaySectionLabel(sectionGroup.section),
  }));

  const lectures =
    sections.find((sectionGroup) => isLecturesSection(sectionGroup.section))
      ?.items ?? [];
  const roadmap: RoadmapItem[] = lectures.slice(0, 3).map((l, idx) => ({
    title: l.title,
    desc: l.summary ?? '',
    href: lessonPathFromMeta({
      slug: l.slug,
      section: l.section ?? 'Lectures',
      group: l.group,
    }),
    tag: idx === 0 ? 'Start here' : idx === 1 ? 'Core' : 'Next',
    disabled: false,
  }));

  return (
    <main className='mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10 space-y-6'>
      <ChapterHeroSection first={first} />
      <ChapterRoadmapSection roadmap={roadmap} first={first} />
      <ExpertAdviceSection />
      <DeeperNotesSection />
      <SectionLessonsGrid sections={normalizedSections} />
    </main>
  );
}
