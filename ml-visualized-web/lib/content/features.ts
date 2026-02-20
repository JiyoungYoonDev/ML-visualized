import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

function getFeatureDir(chapter: string, lessonSlug: string) {
  return path.join(process.cwd(), "content", chapter, lessonSlug);
}

export async function getLessonFeatureBySlug(
  chapter: string,
  lessonSlug: string,
  featureSlug: string
) {
  const dir = getFeatureDir(chapter, lessonSlug);
  const filePath = path.join(dir, `${featureSlug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(raw);
  return { meta: data, content };
}
