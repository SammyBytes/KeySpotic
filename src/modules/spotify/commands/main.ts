import { playPause, nextTrack, previousTrack } from "./player";

export interface Command {
  hotkey: string;
  action: () => void;
}

const hotkeysPath = Bun.file("./hotkeys.json");
const hotkeysText = await hotkeysPath.text();
const hotkeysConfig = JSON.parse(hotkeysText);

console.log("Hotkeys configuration loaded:", hotkeysConfig);

//TODO: Use ZOD or similar for validation
export const spotifyCommands: Command[] = [
  { hotkey: hotkeysConfig.spotify.playPause, action: playPause },
  { hotkey: hotkeysConfig.spotify.nextTrack, action: nextTrack },
  { hotkey: hotkeysConfig.spotify.previousTrack, action: previousTrack },
];
