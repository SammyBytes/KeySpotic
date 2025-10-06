import { startListener } from "./listeners/hotkeys";
import { setupSpotifyAuth } from "./modules/auth/setupSpotifyAuth";
import { spotifyCommands } from "./modules/spotify/commands/main";

const allCommands = [...spotifyCommands];

console.log("Hotkeys listener init...");
startListener(allCommands);
console.log("Hotkeys listener started.");

setupSpotifyAuth();
