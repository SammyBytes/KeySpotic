import { buildCombo, isModifierKey, normalizeModifier } from "./transform";
/**
 * State of the hotkey listener, tracking held keys and active combos.
 *
 */
export interface ListenerState {
  held: Set<string>;
  combos: Set<string>;
}
/**
 * Initializes the listener state with empty held keys and combos.
 * @returns The initial listener state.
 */
export const initialState = (): ListenerState => ({
  held: new Set(),
  combos: new Set(),
});
/**
 * Updates the listener state based on the incoming key event.
 * @param event The key event to process.
 * @param prev The previous listener state.
 * @returns The updated listener state.
 */
export const updateState = (
  event: { name: string; state: "UP" | "DOWN" },
  prev: ListenerState
): ListenerState => {
  const next = {
    held: new Set(prev.held),
    combos: new Set(prev.combos),
  };

  const key = event.name.toUpperCase();
  const isMod = isModifierKey(key);

  if (event.state === "DOWN") {
    if (isMod) {
      next.held.add(normalizeModifier(key));
      return next;
    }

    const combo = buildCombo(next.held, key);
    next.combos.add(combo);
    return next;
  }

  if (event.state === "UP") {
    if (isMod) next.held.delete(normalizeModifier(key));
    else next.combos.clear();
  }

  return next;
};
