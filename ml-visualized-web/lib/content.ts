import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { LessonFeature, LessonMeta } from '@/lib/content/types';

export type Lesson = {
  meta: LessonMeta;
  content: string;
};

export type LessonFeatureDoc = {
  meta: Record<string, unknown>;
  content: string;
};

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function toFeatureSlug(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeFeatures(rawFeatures: unknown): LessonFeature[] | undefined {
  if (!Array.isArray(rawFeatures)) return undefined;

  const normalized = rawFeatures
    .map((item): LessonFeature | null => {
      if (typeof item === 'string') {
        const label = item.trim();
        if (!label) return null;
        const slug = toFeatureSlug(label);
        if (!slug) return null;
        return { label, slug };
      }

      if (typeof item === 'object' && item !== null) {
        const candidate = item as { label?: unknown; slug?: unknown };
        const label =
          typeof candidate.label === 'string'
            ? candidate.label.trim()
            : typeof candidate.slug === 'string'
              ? candidate.slug.trim()
              : '';
        if (!label) return null;

        const slugSource =
          typeof candidate.slug === 'string' ? candidate.slug : label;
        const slug = toFeatureSlug(slugSource);
        if (!slug) return null;

        return { label, slug };
      }

      return null;
    })
    .filter((feature): feature is LessonFeature => feature !== null);

  return normalized.length > 0 ? normalized : undefined;
}

function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeMeta(slug: string, data: any): LessonMeta {
  const normalizedFeatures = normalizeFeatures(data?.features);

  return {
    slug,
    title: String(data?.title ?? slug),
    chapter: String(data?.chapter ?? 'chapter1'),
    section: String(data?.section ?? 'Lectures'),
    features: normalizedFeatures,
    group: data?.group ? String(data.group) : undefined,
    order: Number.isFinite(Number(data?.order)) ? Number(data.order) : 9999,
    summary: data?.summary ? String(data.summary) : undefined,
    navLabel: data?.navLabel ? String(data.navLabel) : undefined,
    iconKey: data?.iconKey
      ? String(data.iconKey)
      : data?.icon
        ? String(data.icon)
        : undefined,
    badge: data?.badge ? String(data.badge) : undefined,
    disabled: Boolean(data?.disabled ?? false),
    exact: Boolean(data?.exact ?? false),
  };
}

export function getChapterContentDir(chapter: string) {
  return path.join(process.cwd(), 'content', chapter);
}

function getLessonDirPath(chapter: string, lessonSlug: string) {
  return path.join(getChapterContentDir(chapter), lessonSlug);
}

function getLessonFilePath(chapter: string, lessonSlug: string) {
  return path.join(getChapterContentDir(chapter), `${lessonSlug}.mdx`);
}

function getLessonIntroductionPath(chapter: string, lessonSlug: string) {
  return path.join(getLessonDirPath(chapter, lessonSlug), 'introduction.mdx');
}

export async function hasLessonIntroduction(
  chapter: string,
  lessonSlug: string,
): Promise<boolean> {
  return exists(getLessonIntroductionPath(chapter, lessonSlug));
}

export async function getAllLessons(chapter: string): Promise<LessonMeta[]> {
  const dir = getChapterContentDir(chapter);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const metas: LessonMeta[] = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      const slug = entry.name.replace(/\.mdx$/, '');
      const raw = await fs.readFile(path.join(dir, entry.name), 'utf8');
      const { data } = matter(raw);
      metas.push(normalizeMeta(slug, data));
      continue;
    }

    if (entry.isDirectory()) {
      const lessonSlug = entry.name;
      const introPath = getLessonIntroductionPath(chapter, lessonSlug);
      if (!(await exists(introPath))) continue;

      const raw = await fs.readFile(introPath, 'utf8');
      const { data } = matter(raw);
      metas.push(normalizeMeta(lessonSlug, data));
    }
  }

  // section -> order -> title
  metas.sort((a, b) => {
    if (a.section !== b.section) return a.section.localeCompare(b.section);
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  return metas;
}

export async function getLessonBySlug(
  chapter: string,
  slug: string,
): Promise<Lesson> {
  const introPath = getLessonIntroductionPath(chapter, slug);
  const filePath = (await exists(introPath))
    ? introPath
    : getLessonFilePath(chapter, slug);

  const raw = await fs.readFile(filePath, 'utf8');
  const { content, data } = matter(raw);

  return {
    meta: normalizeMeta(slug, data),
    content,
  };
}

export async function getSlugs(chapter: string): Promise<string[]> {
  const dir = getChapterContentDir(chapter);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const slugs = new Set<string>();

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.mdx')) {
      slugs.add(entry.name.replace(/\.mdx$/, ''));
      continue;
    }

    if (entry.isDirectory()) {
      const introPath = getLessonIntroductionPath(chapter, entry.name);
      if (await exists(introPath)) {
        slugs.add(entry.name);
      }
    }
  }

  return [...slugs];
}

export async function getLessonFeatures(
  chapter: string,
  lessonSlug: string,
): Promise<LessonFeature[]> {
  const lessonDir = getLessonDirPath(chapter, lessonSlug);
  if (!(await exists(lessonDir))) return [];

  const introPath = getLessonIntroductionPath(chapter, lessonSlug);
  if (await exists(introPath)) {
    const raw = await fs.readFile(introPath, 'utf8');
    const { data } = matter(raw);
    const fromFrontmatter = normalizeFeatures(data?.features);
    if (fromFrontmatter && fromFrontmatter.length > 0) {
      return fromFrontmatter;
    }
  }

  const entries = await fs.readdir(lessonDir, { withFileTypes: true });
  const fromFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => entry.name.replace(/\.mdx$/, ''))
    .filter((slug) => slug !== 'meta')
    .map((slug) => ({
      slug,
      label: slugToLabel(slug),
    }));

  return fromFiles;
}

export async function getLessonFeatureBySlug(
  chapterKey: string,
  lessonSlug: string,
  featureSlug: string,
): Promise<LessonFeatureDoc> {
  if (!featureSlug) {
    throw new Error('feature slug is required');
  }

  const normalizedFeatureSlug = featureSlug.trim().toLowerCase();
  const safeFeatureSlug =
    normalizedFeatureSlug.length > 0 ? normalizedFeatureSlug : 'introduction';

  const filePath = path.join(
    process.cwd(),
    'content',
    chapterKey,
    lessonSlug,
    `${safeFeatureSlug}.mdx`,
  );

  const raw = await fs.readFile(filePath, 'utf8');
  const { content, data } = matter(raw);

  return { meta: data, content };
}
