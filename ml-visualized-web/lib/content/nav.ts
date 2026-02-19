// lib/content/nav.ts
import type {
  LessonMeta,
  NavGroup,
  NavItem,
  NavSection,
} from '@/lib/content/types';

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

  const preferredSectionOrder = ['Bootcamps', 'Lectures', 'Extras'];
  const allSections = [...sectionMap.keys()];
  allSections.sort((a, b) => {
    const ai = preferredSectionOrder.indexOf(a);
    const bi = preferredSectionOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const navSections: NavSection[] = [];

  for (const section of allSections) {
    const subMap = sectionMap.get(section)!;

    const subgroupNames = [...subMap.keys()].sort((a, b) => a.localeCompare(b));

    const preferredSubgroupOrder = section === 'Lectures' ? ['Algorithms'] : [];
    subgroupNames.sort((a, b) => {
      const ai = preferredSubgroupOrder.indexOf(a);
      const bi = preferredSubgroupOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    // ✅ 이 섹션(예: Lectures)을 “section title”로 쓰고
    // 그 안의 subgroup(예: Algorithms)은 ModulesShell에서 section.section 으로 표시되게 할 거라서
    // 여기서는 subgroup별로 NavSection을 여러 개 만들자.
    // -> Bootcamps: [Notation Bootcamp, Pattern Bootcamp] 같은 건 subgroup=Bootcamps 하나로.
    for (const subgroup of subgroupNames) {
      const ls = subMap.get(subgroup)!.slice().sort(sortByOrderThenTitle);

      const items: NavItem[] = ls.map((x) => ({
        label: x.navLabel ?? x.title, // navLabel 있으면 그걸 우선
        href: `${basePath}/${x.slug}`,
        iconKey: x.iconKey,
        badge: x.badge,
        disabled: !!x.disabled,
        exact: x.exact,
        order: x.order ?? 9999,
      }));

      navSections.push({
        // section title 자리에 "Bootcamps" / "Algorithms" 이런 식으로 보이게
        // 너가 원하는 구조: "BOOTCAMPS" 아래에는 바로 Bootcamps 항목들
        // "LECTURES" 아래에는 "Algorithms" 같은 subgroup 노출
        section: subgroup, // << 여기!
        items,
      });
    }
  }

  // 4) 최상위 그룹으로 묶어서 반환
  // ModulesShell에서 group.group(대문자 타이틀) 아래에 sections가 보이는 구조
  return [
    {
      group: topGroupName,
      sections: navSections.map((s) => ({
        // Sidebar에서 "BOOTCAMPS", "LECTURES" 처럼 section 레이블도 필요하면
        // 현재 ModulesShell은 group.group만 보여주고 section.section만 보여줘서
        // "BOOTCAMPS/LECTURES" 레벨이 따로 필요하면 NavGroup을 2개로 쪼개는 방식이 더 깔끔해.
        // 그런데 네 UI는 이미 "BOOTCAMPS", "LECTURES"가 따로 나오길 원하니까
        // 아래처럼 NavGroup을 여러 개로 나누는 방식을 추천함.
        // (아래에서 NavGroup 분리 버전 제공)
        ...s,
      })),
    },
  ];
}

/**
 * ✅ 추천: BOOTCAMPS / LECTURES / EXTRAS 를 NavGroup 레벨로 분리
 * 너 스샷처럼 "BOOTCAMPS" 큰 타이틀이 따로 나오게.
 */
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

  const preferredSectionOrder = ['Bootcamps', 'Lectures', 'Extras'];
  const allSections = [...sectionMap.keys()];
  allSections.sort((a, b) => {
    const ai = preferredSectionOrder.indexOf(a);
    const bi = preferredSectionOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const nav: NavGroup[] = [];

  for (const section of allSections) {
    const subMap = sectionMap.get(section)!;

    const subgroupNames = [...subMap.keys()];
    const preferredSubgroupOrder = section === 'Lectures' ? ['Algorithms'] : [];
    subgroupNames.sort((a, b) => {
      const ai = preferredSubgroupOrder.indexOf(a);
      const bi = preferredSubgroupOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    const sections = subgroupNames.map((subgroup, subgroupIndex) => {
      const ls = subMap.get(subgroup)!.slice().sort(sortByOrderThenTitle);

      const lessonItems: NavItem[] = ls.map((x) => ({
        label: x.navLabel ?? x.title,
        href: `${basePath}/${x.slug}`,
        iconKey: x.iconKey,
        badge: x.badge,
        disabled: !!x.disabled,
        exact: x.exact,
        order: x.order ?? 9999,
      }));

      const shouldShowOverview = section === 'Lectures' && subgroupIndex === 0;
      const overviewTarget = shouldShowOverview ? lessonItems[0] : null;
      const overviewItem: NavItem | null = overviewTarget
        ? {
            label: 'Overview',
            href: `${basePath}`,
            iconKey: overviewTarget.iconKey,
            disabled: overviewTarget.disabled,
            exact: true,
            order: (overviewTarget.order ?? 9999) - 1,
          }
        : null;

      const items = overviewItem ? [overviewItem, ...lessonItems] : lessonItems;

      return { section: subgroup, items };
    });

    nav.push({
      group: section.toUpperCase(), // "BOOTCAMPS", "LECTURES"
      sections,
    });
  }

  return nav;
}
