import { playOrPause, nextTrack, previousTrack } from "./player";
import hotkeysConfig from "../../../../hotkeys.json" with { type: "json" };

export type Command = {
  hotkey: string;
  action: () => void;
};

/**
 * Array of Spotify commands with their associated hotkeys and actions.
 * Each command consists of a hotkey string and a corresponding action function.
 * This array is used to map user inputs to Spotify playback controls.
 */
export const spotifyCommands: Command[] = [
  { hotkey: hotkeysConfig.spotify.playPause, action: playOrPause },
  { hotkey: hotkeysConfig.spotify.nextTrack, action: nextTrack },
  { hotkey: hotkeysConfig.spotify.previousTrack, action: previousTrack },
];
