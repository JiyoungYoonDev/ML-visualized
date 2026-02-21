import type { LessonMeta } from '@/lib/content/types';

export function toPathSegment(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function lessonPathFromMeta(
  meta: Pick<LessonMeta, 'slug' | 'section' | 'group'>,
) {
  const section = toPathSegment(meta.section ?? 'lectures');
  const group = toPathSegment(meta.group ?? meta.section ?? 'lectures');
  if (section === group) {
    return `/modules/${section}/${meta.slug}`;
  }
  return `/modules/${section}/${group}/${meta.slug}`;
}

export function overviewPathFromMeta(
  meta: Pick<LessonMeta, 'section' | 'group'>,
) {
  const section = toPathSegment(meta.section ?? 'lectures');
  const group = toPathSegment(meta.group ?? meta.section ?? 'lectures');
  if (section === group) {
    return `/modules/${section}/overview`;
  }
  return `/modules/${section}/${group}/overview`;
}

export function featurePathFromMeta(
  meta: Pick<LessonMeta, 'slug' | 'section' | 'group'>,
  feature: string,
) {
  return `${lessonPathFromMeta(meta)}/${feature}`;
}
