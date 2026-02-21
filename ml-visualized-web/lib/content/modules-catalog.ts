import fs from 'node:fs/promises';
import path from 'node:path';
import { getAllLessons } from '@/lib/content';
import type { LessonMeta } from '@/lib/content/types';
import { toPathSegment } from '@/lib/content/paths';

const EXCLUDED_MODULE_CHAPTERS = new Set(['mistake-bounded']);

export type ModuleLessonEntry = {
  chapterKey: string;
  lesson: LessonMeta;
};

function normalizeLinearLessons(lessons: LessonMeta[]): LessonMeta[] {
  return lessons.map((lesson) => ({
    ...lesson,
    section: 'Linear Algebra',
    group: 'Linear Algebra',
  }));
}

function normalizeLessonsForChapter(
  chapterKey: string,
  lessons: LessonMeta[],
): LessonMeta[] {
  if (chapterKey === 'linear_algebra') {
    return normalizeLinearLessons(lessons);
  }

  return lessons;
}

export async function getModuleChapterKeys(): Promise<string[]> {
  const contentDir = path.join(process.cwd(), 'content');
  const entries = await fs.readdir(contentDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !EXCLUDED_MODULE_CHAPTERS.has(name));
}

export async function getAllModuleLessonEntries(): Promise<
  ModuleLessonEntry[]
> {
  const chapterKeys = await getModuleChapterKeys();
  const byChapter = await Promise.all(
    chapterKeys.map(async (chapterKey) => {
      try {
        const lessons = await getAllLessons(chapterKey);
        const normalized = normalizeLessonsForChapter(chapterKey, lessons);
        return normalized.map((lesson) => ({ chapterKey, lesson }));
      } catch {
        return [] as ModuleLessonEntry[];
      }
    }),
  );

  return byChapter.flat();
}

export async function findModuleLessonEntryByRoute(params: {
  section: string;
  group: string;
  lesson: string;
}): Promise<ModuleLessonEntry | null> {
  const entries = await getAllModuleLessonEntries();
  const match = entries.find(
    ({ lesson }) =>
      lesson.slug === params.lesson &&
      toPathSegment(lesson.section) === params.section &&
      toPathSegment(lesson.group ?? lesson.section) === params.group,
  );

  return match ?? null;
}

export async function getAllModuleLessons(): Promise<LessonMeta[]> {
  const entries = await getAllModuleLessonEntries();
  return entries.map((entry) => entry.lesson);
}
