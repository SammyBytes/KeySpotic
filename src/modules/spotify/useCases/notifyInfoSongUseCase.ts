import {
  downloadImageTemp,
  sendSystemNotification,
} from "../../../shared/notifications/services/notificationServices";
import { err, ok, Result } from "../../../shared/result";
import { spotifyApi } from "../config/spotify";

type NotifyError = "NotifyFailed" | "NoSongPlaying" | "InfoUnavailable";

let downloadTokenCounter = 0;

export const executeAsync = async (): Promise<Result<boolean, NotifyError>> => {
  try {
    console.debug("[Spotify] Checking current playback...");
    const playback = await spotifyApi.getMyCurrentPlaybackState();

    if (!playback.body || !playback.body.is_playing)
      return err("NoSongPlaying");
    const track = playback.body.item;
    if (!track) return err("InfoUnavailable");

    const title = track.name;
    const songInfo = await spotifyApi.getTrack(track.id);
    const artists = songInfo.body.artists.map((a) => a.name).join(", ");
    const album = songInfo.body.album.name;
    const photo = songInfo.body.album.images[0]?.url;

    console.debug(
      `[Spotify] Now playing: "${title}" by ${artists} from "${album}"`
    );
    if (photo) console.debug("[Spotify] Album art URL:", photo);

    const notificationMessage = `Title: ${title}\nArtist(s): ${artists}\nAlbum: ${album}`;

    // Generate download token
    const token = ++downloadTokenCounter;

    // Send notification immediately (without image or with cache)
    let photoPath: string | undefined;
    if (photo) {
      // Use cache without blocking
      photoPath = await downloadImageTemp(photo, token);
    }

    sendSystemNotification({
      title,
      message: notificationMessage,
      iconPath: photoPath,
    });

    return ok(true);
  } catch (error) {
    console.error("[Spotify] Error notifying song info:", error);
    return err("NotifyFailed");
  }
};
