import {
  GlobalKeyboardListener,
  IGlobalKeyEvent,
} from "node-global-key-listener";
import { Command } from "../modules/hotkey/core/engine";
import { initialState, updateState } from "../modules/hotkey/core/state";
import { executeCommands } from "../modules/hotkey/core/engine";

const IGNORED_EVENTS = ["MOUSE"];

/**
 * Starts the global hotkey listener and processes key events.
 * @param commands The list of registered commands to execute on hotkey presses.
 * @returns A function to stop the listener.
 */
export const startListener = (commands: Command[]) => {
  const keyboard = new GlobalKeyboardListener();
  let internalState = initialState();

  keyboard.addListener((event: IGlobalKeyEvent) => {
    if (!event.name || IGNORED_EVENTS.includes(event.name)) return;

    const data = { name: event.name, state: event.state };
    // Transform the state immutably
    internalState = updateState(data, internalState);

    // Evaluate the current state and execute commands
    const actions = executeCommands(internalState, data, commands);

    // Execute all matched actions
    actions.forEach((act) => act());
  });
};
