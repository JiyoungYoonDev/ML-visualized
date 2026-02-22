export function toDisplaySectionLabel(section: string): string {
  const normalized = section.toLowerCase().trim();

  if (normalized === 'lectures') {
    return 'Machine Learning';
  }

  return section;
}

export function isLecturesSection(section: string): boolean {
  return section.toLowerCase().trim() === 'lectures';
}

function toWords(value: string): string {
  return value.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function toTitleCase(value: string): string {
  const normalized = toWords(value).toLowerCase();
  return normalized
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function toSectionGroupLabel(section: string, group?: string): string {
  const sectionLabel = toDisplaySectionLabel(toTitleCase(section));
  const groupLabel = group ? toTitleCase(group) : sectionLabel;

  if (sectionLabel.toLowerCase() === groupLabel.toLowerCase()) {
    return sectionLabel;
  }

  return `${sectionLabel} · ${groupLabel}`;
}

export function toGroupLabel(group: string): string {
  return toTitleCase(group);
}
