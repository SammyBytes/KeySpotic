import { ListenerState } from "./state";
/**
 * Represents a command with its associated hotkey and action.
 */
export interface Command {
  hotkey: string;
  action: () => void;
}

/**
 * Represents an engine event for key actions.
 * @property name The name of the key.
 * @property state The state of the key, either "UP" or "DOWN".
 */
export interface EngineEvent {
  name: string;
  state: "UP" | "DOWN";
}
/**
 * Executes the commands associated with the currently pressed hotkeys.
 * @param state The current listener state.
 * @param event The key event to process.
 * @param commands The list of registered commands.
 * @returns An array of functions to execute the matched commands.
 */
export const executeCommands = (
  state: ListenerState,
  event: EngineEvent,
  commands: Command[]
): (() => void)[] => {
  if (!event.name) return [];

  const pressedCombos = Array.from(state.combos);
  return commands
    .filter((cmd) => pressedCombos.includes(cmd.hotkey))
    .map((cmd) => cmd.action);
};
