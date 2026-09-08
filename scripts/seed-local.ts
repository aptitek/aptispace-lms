import path from "node:path";
import { getPlatformProxy } from "wrangler";
import { getDb } from "../app/db";
import { seedDatabase } from "../app/db/seed";

async function main() {
  process.stdout.write(
    "🌱 Connecting to local D1 database via Wrangler platform proxy...\n",
  );
  const proxy = await getPlatformProxy({
    configPath: path.resolve(process.cwd(), "wrangler.jsonc"),
    persist: true,
  });

  try {
    const d1 = (proxy.env as { DB?: Parameters<typeof getDb>[0] }).DB;
    if (!d1) {
      throw new Error("Could not find 'DB' binding in local platform proxy.");
    }

    const db = getDb(d1);
    process.stdout.write("🌱 Seeding local D1 database...\n");
    const result = await seedDatabase(db);
    process.stdout.write(
      `✅ Local D1 database seeded successfully: ${JSON.stringify(result)}\n`,
    );

    interface LocalR2Bucket {
      put(
        key: string,
        value: unknown,
        options?: { httpMetadata?: { contentType?: string } },
      ): Promise<unknown>;
    }

    const bucket = (proxy.env as { AVATARS_BUCKET?: LocalR2Bucket })
      .AVATARS_BUCKET;
    if (bucket) {
      process.stdout.write(
        "📦 Uploading seed avatars to local R2 AVATARS_BUCKET...\n",
      );
      const fs = await import("node:fs/promises");
      const avatarFiles = [
        "seed-sarah.webp",
        "seed-alex.webp",
        "seed-elena.webp",
        "seed-cadet.webp",
      ];
      for (const filename of avatarFiles) {
        const filePath = path.resolve(
          process.cwd(),
          "public/avatars",
          filename,
        );
        try {
          const data = await fs.readFile(filePath);
          await bucket.put(`avatars/${filename}`, data, {
            httpMetadata: { contentType: "image/webp" },
          });
          await bucket.put(filename, data, {
            httpMetadata: { contentType: "image/webp" },
          });
          process.stdout.write(`  ✓ Uploaded ${filename} to R2\n`);
        } catch (readErr) {
          process.stdout.write(`  ⚠ Could not load ${filename}: ${readErr}\n`);
        }
      }
    }
  } finally {
    await proxy.dispose();
  }
}

main().catch((err) => {
  console.error("❌ Failed to seed local database:", err);
  process.exit(1);
});
