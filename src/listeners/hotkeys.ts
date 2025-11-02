import {
  GlobalKeyboardListener,
  IGlobalKeyEvent,
} from "node-global-key-listener";
import { Command } from "../spotify/commands/main";

function normalizeModifier(key: string) {
  if (!key) return "";
  if (key.includes("CTRL")) return "CTRL";
  if (key.includes("ALT")) return "ALT";
  if (key.includes("SHIFT")) return "SHIFT";
  if (key.includes("META")) return "META";
  return key.toUpperCase();
}

function buildCombo(heldModifiers: Set<string>, key: string) {
  // Order fixed for consistency: CTRL + ALT + SHIFT + META + key
  const order = ["CTRL", "ALT", "SHIFT", "META"];
  const mods = order.filter((m) => heldModifiers.has(m));
  return mods.length
    ? [...mods, key.toUpperCase()].join(" + ")
    : key.toUpperCase();
}

export function startListener(commands: Command[]) {
  const keyboard = new GlobalKeyboardListener();
  const heldModifiers = new Set<string>();
  const loggedCombos = new Set<string>();

  const MODIFIERS = new Set([
    "LEFT CTRL",
    "RIGHT CTRL",
    "LEFT ALT",
    "RIGHT ALT",
    "LEFT SHIFT",
    "RIGHT SHIFT",
  ]);

  keyboard.addListener((e: IGlobalKeyEvent) => {
    if (!e.name || e.name.includes("MOUSE")) return;

    const key = e.name.toUpperCase();

    if (e.state === "DOWN") {
      if (MODIFIERS.has(key)) {
        heldModifiers.add(normalizeModifier(key));
      } else {
        const combo = buildCombo(heldModifiers, key);

        if (!loggedCombos.has(combo)) {
          loggedCombos.add(combo);

          const cmd = commands.find((c) => c.hotkey === combo);
          if (cmd) cmd.action();
        }
      }
    } else if (e.state === "UP") {
      const normalizedKey = normalizeModifier(key);
      if (MODIFIERS.has(key)) heldModifiers.delete(normalizedKey);
      else loggedCombos.clear();
    }
  });
}
