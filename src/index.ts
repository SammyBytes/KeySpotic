import { startListener } from "./listeners/hotkeys";
import { initSpotifyAuth } from "./spotify/startup";
import { spotifyCommands } from "./spotify/commands/main";

const allCommands = [...spotifyCommands];

console.log("Hotkeys listener init...");
startListener(allCommands);
console.log("Hotkeys listener started.");

initSpotifyAuth();
