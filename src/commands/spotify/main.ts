import { playPause, nextTrack, previousTrack } from "./spotify";

export interface Command {
  hotkey: string;
  action: () => void;
}

export const spotifyCommands: Command[] = [
  { hotkey: "CTRL + ALT + P", action: playPause },
  { hotkey: "CTRL + SHIFT + RIGHT ARROW", action: nextTrack },
  { hotkey: "CTRL + SHIFT + LEFT ARROW", action: previousTrack },
];
