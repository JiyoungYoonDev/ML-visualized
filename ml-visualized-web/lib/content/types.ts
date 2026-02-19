import type React from 'react';

export type LessonMeta = {
  slug: string;
  title: string;
  section?: string;
  group?: string;
  order?: number;
  summary?: string;
  navLabel?: string;
  iconKey?: string;
  badge?: string;
  disabled?: boolean;
  exact?: boolean;
};

export type LessonFrontmatter = {
  chapter: string;
  section: string;
  title: string;
  order: number;
  slug: string;
  summary?: string;
  icon?: string;
  disabled?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  iconKey?: string;
  badge?: string;
  disabled?: boolean;
  exact?: boolean;
  order: number;
};

export type NavSection = {
  section: string;
  items: NavItem[];
};

export type NavGroup = {
  group: string;
  sections: NavSection[];
};

export type NavItemWithIcon = Omit<NavItem, 'iconKey'> & {
  icon: React.ElementType;
};

export type NavSectionWithIcon = Omit<NavSection, 'items'> & {
  items: NavItemWithIcon[];
};

export type NavGroupWithIcon = Omit<NavGroup, 'sections'> & {
  sections: NavSectionWithIcon[];
};
