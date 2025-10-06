import { startListener } from "./listeners/hotkeys";
import { spotifyCommands } from "./commands/spotify/main";

const allCommands = [...spotifyCommands];

console.log("Hotkeys listener init...");
startListener(allCommands);
