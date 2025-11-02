import { mkdirSync, cpSync } from "fs";
import { join } from "path";

const targets = ["linux", "mac", "win"];

for (const target of targets) {
  const base = join("dist", target);

  // Create directories if they don't exist
  mkdirSync(base, { recursive: true });
  mkdirSync(join(base, "certs"), { recursive: true });

  // Copy common files
  cpSync(".env.example", join(base, ".env.example"));
  cpSync("hotkeys.json", join(base, "hotkeys.json"));

  // Copy certificates
  cpSync("certs/cert.pem", join(base, "certs/cert.pem"));
  cpSync("certs/key.pem", join(base, "certs/key.pem"));

  console.log(`Files copied for ${target}`);
}
