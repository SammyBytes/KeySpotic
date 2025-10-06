import { playPause, nextTrack, previousTrack } from "./player";
import path from "path";

export interface Command {
  hotkey: string;
  action: () => void;
}
const root = process.cwd();
const hotkeysPath = Bun.file(path.join(root, "hotkeys.json"));
const hotkeysText = await hotkeysPath.text();
const hotkeysConfig = JSON.parse(hotkeysText);

//TODO: Use ZOD or similar for validation
export const spotifyCommands: Command[] = [
  { hotkey: hotkeysConfig.spotify.playPause, action: playPause },
  { hotkey: hotkeysConfig.spotify.nextTrack, action: nextTrack },
  { hotkey: hotkeysConfig.spotify.previousTrack, action: previousTrack },
];
