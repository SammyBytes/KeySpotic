import { startListener } from "./listeners/hotkeys";
import { initSpotifyAuth } from "./modules/spotify/startup";
import { spotifyCommands } from "./modules/spotify/commands/main";

const allCommands = [...spotifyCommands];

console.log("Hotkeys listener init...");
startListener(allCommands);
console.log("Hotkeys listener started.");

initSpotifyAuth();
