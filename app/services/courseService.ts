import { eq } from "drizzle-orm";
import type { Database } from "../db/index";
import { modules, type Module, type NewModule } from "../db/schema";

export async function getCourses(db: Database): Promise<Module[]> {
  return db.select().from(modules);
}

export async function getCourseById(
  db: Database,
  courseId: string,
): Promise<Module | null> {
  const result = await db
    .select()
    .from(modules)
    .where(eq(modules.id, courseId))
    .limit(1);
  return result[0] ?? null;
}

export async function getCourseWithModules(db: Database, courseId: string) {
  return db.query.modules.findFirst({
    where: eq(modules.id, courseId),
    with: {
      activities: true,
      cohort: true,
    },
  });
}

export async function createCourse(
  db: Database,
  courseFields: Omit<NewModule, "createdAt" | "updatedAt">,
): Promise<Module> {
  const now = new Date();
  const [created] = await db
    .insert(modules)
    .values({
      ...courseFields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}
