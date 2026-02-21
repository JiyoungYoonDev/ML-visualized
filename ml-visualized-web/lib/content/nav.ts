import type {
  LessonMeta,
  NavGroup,
  NavItem,
  NavSection,
} from '@/lib/content/types';
import { lessonPathFromMeta, overviewPathFromMeta } from '@/lib/content/paths';
import { isLecturesSection, toDisplaySectionLabel } from '@/lib/content/labels';

function normalizeOrderKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-');
}

function sortByOrderThenTitle(
  a: { order?: number; title: string },
  b: { order?: number; title: string },
) {
  const ao = a.order ?? 9999;
  const bo = b.order ?? 9999;
  if (ao !== bo) return ao - bo;
  return a.title.localeCompare(b.title);
}

export function buildNavGroups({
  basePath,
  lessons,
  sidebarTitle,
}: {
  basePath: string;
  lessons: LessonMeta[];
  sidebarTitle?: string;
}): NavGroup[] {
  const topGroupName = sidebarTitle ?? 'CHAPTER 1: FOUNDATIONS';

  const sectionMap = new Map<string, Map<string, LessonMeta[]>>();

  for (const l of lessons) {
    const section = l.section ?? 'Lectures';
    const subgroup = l.group ?? section;

    if (!sectionMap.has(section)) sectionMap.set(section, new Map());
    const subMap = sectionMap.get(section)!;

    if (!subMap.has(subgroup)) subMap.set(subgroup, []);
    subMap.get(subgroup)!.push(l);
  }

  const preferredSectionOrder = [
    'bootcamps',
    'linear-algebra',
    'lectures',
    'extras',
  ];
  const allSections = [...sectionMap.keys()];
  allSections.sort((a, b) => {
    const ai = preferredSectionOrder.indexOf(normalizeOrderKey(a));
    const bi = preferredSectionOrder.indexOf(normalizeOrderKey(b));
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const navSections: NavSection[] = [];

  for (const section of allSections) {
    const subMap = sectionMap.get(section)!;

    const subgroupNames = [...subMap.keys()].sort((a, b) => a.localeCompare(b));

    const preferredSubgroupOrder = isLecturesSection(section)
      ? ['Algorithms']
      : [];
    subgroupNames.sort((a, b) => {
      const ai = preferredSubgroupOrder.indexOf(a);
      const bi = preferredSubgroupOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    for (const subgroup of subgroupNames) {
      const ls = subMap.get(subgroup)!.slice().sort(sortByOrderThenTitle);

      const overviewItem: NavItem = {
        label: 'Overview',
        href:
          basePath === '/modules'
            ? overviewPathFromMeta({ section, group: subgroup })
            : `${basePath}/overview`,
        iconKey: ls[0]?.iconKey,
        badge: undefined,
        disabled: false,
        exact: true,
        order: -1,
      };

      const lessonItems: NavItem[] = ls.map((x) => ({
        label: x.navLabel ?? x.title,
        href:
          basePath === '/modules'
            ? lessonPathFromMeta(x)
            : `${basePath}/${x.slug}`,
        iconKey: x.iconKey,
        badge: x.badge,
        disabled: !!x.disabled,
        exact: x.exact,
        order: x.order ?? 9999,
      }));

      const items: NavItem[] = [overviewItem, ...lessonItems];

      navSections.push({
        section: subgroup,
        items,
      });
    }
  }

  return [
    {
      group: topGroupName,
      sections: navSections.map((s) => ({
        ...s,
      })),
    },
  ];
}

export function buildNavGroupsSplit({
  basePath,
  lessons,
}: {
  basePath: string;
  lessons: LessonMeta[];
}): NavGroup[] {
  const sectionMap = new Map<string, Map<string, LessonMeta[]>>();

  for (const l of lessons) {
    const section = l.section ?? 'Lectures';
    const subgroup = l.group ?? section;
    if (!sectionMap.has(section)) sectionMap.set(section, new Map());
    const subMap = sectionMap.get(section)!;
    if (!subMap.has(subgroup)) subMap.set(subgroup, []);
    subMap.get(subgroup)!.push(l);
  }

  const preferredSectionOrder = [
    'bootcamps',
    'optimization',
    'linear-algebra',
    'lectures',
    'extras',
  ];
  const allSections = [...sectionMap.keys()];
  allSections.sort((a, b) => {
    const ai = preferredSectionOrder.indexOf(normalizeOrderKey(a));
    const bi = preferredSectionOrder.indexOf(normalizeOrderKey(b));
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const nav: NavGroup[] = [];

  for (const section of allSections) {
    const subMap = sectionMap.get(section)!;

    const subgroupNames = [...subMap.keys()];
    const preferredSubgroupOrder = isLecturesSection(section)
      ? ['Algorithms']
      : [];
    subgroupNames.sort((a, b) => {
      const ai = preferredSubgroupOrder.indexOf(a);
      const bi = preferredSubgroupOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    const sections = subgroupNames.map((subgroup) => {
      const ls = subMap.get(subgroup)!.slice().sort(sortByOrderThenTitle);

      const overviewItem: NavItem = {
        label: 'Overview',
        href:
          basePath === '/modules'
            ? overviewPathFromMeta({ section, group: subgroup })
            : `${basePath}/overview`,
        iconKey: ls[0]?.iconKey,
        badge: undefined,
        disabled: false,
        exact: true,
        order: -1,
      };

      const lessonItems: NavItem[] = ls.map((x) => ({
        label: x.navLabel ?? x.title,
        href:
          basePath === '/modules'
            ? lessonPathFromMeta(x)
            : `${basePath}/${x.slug}`,
        iconKey: x.iconKey,
        badge: x.badge,
        disabled: !!x.disabled,
        exact: x.exact,
        order: x.order ?? 9999,
      }));

      return { section: subgroup, items: [overviewItem, ...lessonItems] };
    });

    nav.push({
      group: toDisplaySectionLabel(section).toUpperCase(),
      sections,
    });
  }

  return nav;
}
