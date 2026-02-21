export type LessonMeta = {
  slug: string;
  title: string;
  summary?: string;
  order?: number;
  section?: string;
  group?: string;
};

export type SectionGroup = {
  section: string;
  items: LessonMeta[];
};

export type RoadmapItem = {
  title: string;
  desc: string;
  href: string;
  tag: string;
  disabled: boolean;
};
