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
