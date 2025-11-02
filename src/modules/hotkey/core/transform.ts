/**
 * Normalizes various modifier key names to standard forms.
 * @param key The key name to normalize.
 * @returns The normalized key name.
 */
export const normalizeModifier = (key: string): string => {
  if (!key) return "";
  const map = {
    CTRL: ["LEFT CTRL", "RIGHT CTRL", "CTRL"],
    ALT: ["LEFT ALT", "RIGHT ALT", "ALT"],
    SHIFT: ["LEFT SHIFT", "RIGHT SHIFT", "SHIFT"],
    META: ["LEFT META", "RIGHT META", "META", "SUPER", "WINDOWS"],
  } as const;

  for (const [normalized, variants] of Object.entries(map)) {
    if (variants.some((v) => key.includes(v))) return normalized;
  }

  return key.toUpperCase();
};

/**
 * Checks if the given key is a modifier key.
 * @param key The key name to check.
 * @returns True if the key is a modifier key, false otherwise.
 */
export const isModifierKey = (key: string): boolean =>
  ["CTRL", "ALT", "SHIFT", "META"].some((m) => key.includes(m));

/**
 * Builds a combo string from held modifier keys and the main key.
 * @param held The set of currently held modifier keys.
 * @param key The main key to include in the combo.
 * @returns The constructed combo string.
 */
export const buildCombo = (held: Set<string>, key: string): string => {
  const order = ["CTRL", "ALT", "SHIFT", "META"];
  const mods = order.filter((m) => held.has(m));
  return [...mods, key.toUpperCase()].join(" + ");
};
