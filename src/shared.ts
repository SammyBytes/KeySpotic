import { dirname } from "path";
export const isProduction = Bun.env.NODE_ENV === "production";
/**
 * The directory where the main Bun script is located.
 * This is useful for resolving paths relative to the executable.
 * @example
 * ```ts
 * import { binDir } from "./shared";
 * import path from "path";
 *
 * const configPath = path.join(binDir, "config", "settings.json");
 * ```
 */
export const binDir = dirname(Bun.main);
