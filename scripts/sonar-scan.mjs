import { scan } from "@sonar/scan";
import http from "node:http";
import https from "node:https";

const SONAR_HOST_URL = process.env.SONAR_HOST_URL || "http://localhost:9000";
const IS_CI = Boolean(process.env.CI);
const HAS_TOKEN = Boolean(process.env.SONAR_TOKEN);

async function checkServerReachable(urlStr) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlStr);
      const client = url.protocol === "https:" ? https : http;
      const req = client.request(
        {
          hostname: url.hostname,
          port: url.port || (url.protocol === "https:" ? 443 : 80),
          path: "/api/system/status",
          method: "GET",
          timeout: 3000,
        },
        (res) => {
          resolve(res.statusCode !== undefined);
        },
      );

      req.on("error", () => resolve(false));
      req.on("timeout", () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function runSonarScan() {
  console.log("🔍 Checking SonarQube connectivity at:", SONAR_HOST_URL);

  const isReachable = await checkServerReachable(SONAR_HOST_URL);

  if (!isReachable && !IS_CI && !HAS_TOKEN) {
    console.warn(
      "\n⚠️  SonarQube server is not currently reachable at " + SONAR_HOST_URL,
    );
    console.warn("💡 To start a local SonarQube instance, run:");
    console.warn("     pnpm run sonar:server");
    console.warn("\n💡 If using SonarCloud or a remote server, export:");
    console.warn("     export SONAR_HOST_URL=https://sonarcloud.io");
    console.warn("     export SONAR_TOKEN=<your-token>");
    console.warn(
      "\nℹ️  Local shift-left quality gate is active via ESLint (eslint-plugin-sonarjs).",
    );
    console.warn(
      "   Code quality & security rules are enforced in husky pre-commit.\n",
    );
    return;
  }

  console.log("🚀 Starting SonarQube analysis...");
  try {
    await scan({
      options: {
        "sonar.host.url": SONAR_HOST_URL,
      },
    });
    console.log("✅ SonarQube analysis completed successfully.");
  } catch (err) {
    console.error("❌ SonarQube analysis failed:", err.message || err);
    if (IS_CI) {
      process.exit(1);
    }
  }
}

runSonarScan();
