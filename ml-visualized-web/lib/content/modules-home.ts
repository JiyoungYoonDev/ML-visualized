import { getAllLessons } from '@/lib/content';
import type { LessonMeta } from '@/lib/content/types';

export type ModuleHomeSection = {
  section: string;
  items: LessonMeta[];
};

export async function getModulesHomeData(): Promise<{
  lessons: LessonMeta[];
  sections: ModuleHomeSection[];
  first: LessonMeta | null;
}> {
  const lessons = await getAllLessons('chapter1');

  const bySection = new Map<string, LessonMeta[]>();
  for (const lesson of lessons) {
    const key = lesson.section ?? 'Lectures';
    if (!bySection.has(key)) bySection.set(key, []);
    bySection.get(key)!.push(lesson);
  }

  const sections = [...bySection.entries()].map(([section, items]) => ({
    section,
    items: [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }));

  const first = lessons[0] ?? null;

  return { lessons, sections, first };
}
