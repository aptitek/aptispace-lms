import { eq } from "drizzle-orm";
import type { Database } from "../db/index";
import {
  courses,
  modules,
  tags,
  moduleTags,
  criteria,
  type Course,
  type NewCourse,
  type Module,
  type NewModule,
  type Criterion,
} from "../db/schema";

export async function getCourses(db: Database): Promise<Course[]> {
  return db.select().from(courses);
}

export async function getCourseById(
  db: Database,
  courseId: string,
): Promise<Course | null> {
  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);
  return result[0] ?? null;
}

export async function getCourseWithModules(db: Database, courseId: string) {
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      modules: {
        with: {
          moduleTags: {
            with: {
              tag: true,
            },
          },
          criteria: true,
        },
      },
      sessions: {
        with: {
          cohort: true,
        },
      },
    },
  });
  return course ?? null;
}

export async function getModuleDetails(db: Database, moduleId: string) {
  const module = await db.query.modules.findFirst({
    where: eq(modules.id, moduleId),
    with: {
      course: true,
      moduleTags: {
        with: {
          tag: true,
        },
      },
      criteria: true,
      submissions: {
        with: {
          user: true,
          grades: true,
        },
      },
    },
  });
  return module ?? null;
}

export async function createCourse(
  db: Database,
  courseFields: Omit<NewCourse, "createdAt" | "updatedAt">,
): Promise<Course> {
  const now = new Date();
  const [created] = await db
    .insert(courses)
    .values({
      ...courseFields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return created;
}

export async function createModule(
  db: Database,
  moduleFields: Omit<NewModule, "createdAt" | "updatedAt">,
  tagNames: string[] = [],
): Promise<Module> {
  const now = new Date();
  const [created] = await db
    .insert(modules)
    .values({
      ...moduleFields,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  for (const tagName of tagNames) {
    let [existingTag] = await db
      .select()
      .from(tags)
      .where(eq(tags.name, tagName))
      .limit(1);

    if (!existingTag) {
      [existingTag] = await db
        .insert(tags)
        .values({
          name: tagName,
          createdAt: now,
        })
        .returning();
    }

    await db
      .insert(moduleTags)
      .values({
        moduleId: created.id,
        tagId: existingTag.id,
      })
      .onConflictDoNothing();
  }

  return created;
}

export async function addCriteriaToModule(
  db: Database,
  moduleId: string,
  criteriaList: Array<{
    name: string;
    maxPoints?: number;
    coefficient?: number;
  }>,
): Promise<Criterion[]> {
  const now = new Date();
  const results: Criterion[] = [];

  for (const criteriaEntry of criteriaList) {
    const [c] = await db
      .insert(criteria)
      .values({
        moduleId,
        name: criteriaEntry.name,
        maxPoints: criteriaEntry.maxPoints ?? 20,
        coefficient: criteriaEntry.coefficient ?? 1,
        createdAt: now,
      })
      .returning();
    results.push(c);
  }

  return results;
}
