import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export type LessonMeta = {
  slug: string;
  title: string;
  chapter: string; // e.g. "chapter1"
  section: string; // e.g. "Lectures"
  group?: string;
  order: number;
  summary?: string;
  navLabel?: string;
  iconKey?: string;
  badge?: string;
  disabled?: boolean;
  exact?: boolean;
};

export type Lesson = {
  meta: LessonMeta;
  content: string;
};

function normalizeMeta(slug: string, data: any): LessonMeta {
  return {
    slug,
    title: String(data?.title ?? slug),
    chapter: String(data?.chapter ?? 'chapter1'),
    section: String(data?.section ?? 'Lectures'),
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

export async function getAllLessons(chapter: string): Promise<LessonMeta[]> {
  const dir = getChapterContentDir(chapter);
  const files = await fs.readdir(dir);

  const mdxFiles = files.filter((f) => f.endsWith('.mdx'));
  const metas: LessonMeta[] = [];

  for (const file of mdxFiles) {
    const slug = file.replace(/\.mdx$/, '');
    const raw = await fs.readFile(path.join(dir, file), 'utf8');
    const { data } = matter(raw);
    metas.push(normalizeMeta(slug, data));
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
  const dir = getChapterContentDir(chapter);
  const filePath = path.join(dir, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { content, data } = matter(raw);

  return {
    meta: normalizeMeta(slug, data),
    content,
  };
}

export async function getSlugs(chapter: string): Promise<string[]> {
  const dir = getChapterContentDir(chapter);
  const files = await fs.readdir(dir);
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
