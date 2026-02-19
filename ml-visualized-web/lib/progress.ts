export const DONE_KEY = 'mlv:done';
export const QUIZ_KEY = 'mlv:quiz';
export const PROGRESS_EVENT = 'mlv:progress-changed';

type QuizAnswer = {
  selected: number;
  correct: boolean;
};

type QuizLessonState = {
  total?: number;
  answers: Record<string, QuizAnswer>;
};

type QuizStore = Record<string, QuizLessonState>;

function emitProgressChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function readDone(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DONE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function writeDone(slugs: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DONE_KEY, JSON.stringify(slugs));
  emitProgressChanged();
}

export function isDone(slug: string, done: string[]) {
  return done.includes(slug);
}

export function toggleDone(slug: string) {
  const done = readDone();
  const next = done.includes(slug)
    ? done.filter((s) => s !== slug)
    : [...done, slug];
  writeDone(next);
  return next;
}

function readQuizStore(): QuizStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(QUIZ_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeQuizStore(store: QuizStore) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(QUIZ_KEY, JSON.stringify(store));
  emitProgressChanged();
}

function ensureLessonState(store: QuizStore, slug: string): QuizLessonState {
  const existing = store[slug];
  if (existing && typeof existing === 'object' && existing.answers) {
    return existing;
  }
  const created: QuizLessonState = { answers: {} };
  store[slug] = created;
  return created;
}

function addDone(slug: string) {
  const done = readDone();
  if (done.includes(slug)) return;
  writeDone([...done, slug]);
}

export function setQuizTotal(slug: string, total: number) {
  if (!slug || total <= 0) return;
  const store = readQuizStore();
  const lesson = ensureLessonState(store, slug);
  lesson.total = total;
  writeQuizStore(store);
  maybeAutoMarkDone(slug, store);
}

export function getQuizAnswer(slug: string, quizId: string) {
  const store = readQuizStore();
  return store[slug]?.answers?.[quizId];
}

export function setQuizAnswer(
  slug: string,
  quizId: string,
  selected: number,
  correct: boolean,
) {
  if (!slug || !quizId) return;
  const store = readQuizStore();
  const lesson = ensureLessonState(store, slug);
  lesson.answers[quizId] = { selected, correct };
  writeQuizStore(store);
  maybeAutoMarkDone(slug, store);
}

export function getQuizCompletion(slug: string) {
  const store = readQuizStore();
  const lesson = store[slug];
  const answers = lesson?.answers ?? {};
  const values = Object.values(answers);
  const answered = values.length;
  const correct = values.filter((x) => x.correct).length;
  const total = lesson?.total ?? 0;

  return {
    total,
    answered,
    correct,
    completed: total > 0 && correct >= total,
  };
}

export function readQuizProgressMap() {
  const store = readQuizStore();
  const result: Record<
    string,
    { total: number; answered: number; correct: number; completed: boolean }
  > = {};

  for (const [slug, lesson] of Object.entries(store)) {
    const answers = Object.values(lesson?.answers ?? {});
    const answered = answers.length;
    const correct = answers.filter((x) => x.correct).length;
    const total = lesson?.total ?? 0;

    result[slug] = {
      total,
      answered,
      correct,
      completed: total > 0 && correct >= total,
    };
  }

  return result;
}

function maybeAutoMarkDone(slug: string, store?: QuizStore) {
  const source = store ?? readQuizStore();
  const lesson = source[slug];
  if (!lesson || !lesson.total || lesson.total <= 0) return;

  const answers = Object.values(lesson.answers ?? {});
  const correct = answers.filter((x) => x.correct).length;

  if (correct >= lesson.total) {
    addDone(slug);
  }
}
