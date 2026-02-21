import { getAllLessons } from '@/lib/content';
import type { LessonMeta } from '@/lib/content/types';

function normalizeLinearLessons(lessons: LessonMeta[]): LessonMeta[] {
  return lessons.map((lesson) => ({
    ...lesson,
    section: 'Linear Algebra',
    group: 'Linear Algebra',
  }));
}

export async function getAllModuleLessons(): Promise<LessonMeta[]> {
  const [chapterLessons, linearLessons] = await Promise.all([
    getAllLessons('chapter1'),
    getAllLessons('linear_algebra').catch(() => []),
  ]);

  return [...chapterLessons, ...normalizeLinearLessons(linearLessons)];
}
