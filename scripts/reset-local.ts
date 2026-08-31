import path from "node:path";
import { getPlatformProxy } from "wrangler";
import { getDb } from "../app/db";
import { resetDatabase } from "../app/db/seed";

async function main() {
  process.stdout.write(
    "🧹 Connecting to local D1 database via Wrangler platform proxy...\n",
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
    process.stdout.write("🧹 Resetting local D1 database tables...\n");
    const result = await resetDatabase(db);
    process.stdout.write(
      `✅ Local D1 database reset successfully: ${JSON.stringify(result)}\n`,
    );
  } finally {
    await proxy.dispose();
  }
}

main().catch((err) => {
  console.error("❌ Failed to reset local database:", err);
  process.exit(1);
});
