import { binDir } from "../../../shared/shared";
import { playOrPause, nextTrack, previousTrack } from "./player";
import { join } from "path";

export type Command = {
  hotkey: string;
  action: () => void;
};
const hotkeysText = await Bun.file(join(binDir, "hotkeys.json")).text();
const hotkeysConfig = JSON.parse(hotkeysText);

/**
 * Array of Spotify commands with their associated hotkeys and actions.
 * Each command consists of a hotkey string and a corresponding action function.
 * This array is used to map user inputs to Spotify playback controls.
 */
export const spotifyCommands: Command[] = [
  { hotkey: hotkeysConfig.spotify.playOrPause, action: playOrPause },
  { hotkey: hotkeysConfig.spotify.nextTrack, action: nextTrack },
  { hotkey: hotkeysConfig.spotify.previousTrack, action: previousTrack },
];
