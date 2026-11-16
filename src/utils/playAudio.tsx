// TODO: Consider https://github.com/expo/expo/issues/146 (comment by gkufera) or webview
// Also consider preloading all the audio and then resetting their positions back to 0, as per https://forums.expo.io/t/laggy-audio-on-multiple-plays/3169

import { createAudioPlayer, AudioPlayer, AudioSource } from 'expo-audio';

import Actions from 'reducers/settings/actionTypes';
import { ReduxState } from 'reducers/store';

export interface PlaybackOptions {
  shouldPlay?: boolean;
  isLooping?: boolean;
  isMuted?: boolean;
  volume?: number;
  positionMillis?: number;
}

const defaultOptions = {
  shouldPlay: true,
  isLooping: false,
  isMuted: false,
  positionMillis: 0,
};

type MiddlewareArg = {getState: () => ReduxState};
type Action = {type: Actions, payload?: any};
type Next = (action: Action) => any;

export const changePlaybackOptions = ({ getState }: MiddlewareArg) => (
  (next: Next) => (action: Action) => {
    if (action.type === Actions.TOGGLE_SFX) {
      defaultOptions.isMuted = getState().settings.sfx;
    } else if (action.type === Actions.INIT_SETTINGS) {
      defaultOptions.isMuted = (action.payload.sfx === false) || !getState().settings.sfx;
    }
    return next(action);
  }
);

export const playAudioWithPreload = async (name: string, source: AudioSource, setSoundPlayback?: (res: any) => any, options?: PlaybackOptions) => {
  // TODO: Make this function
  const initialStatus = {
    ...defaultOptions,
    ...options,
  }
};

const cachedAudio = new Map<number, AudioPlayer>();

/**
 * Play an audio file asynchronously.
 *
 * @param source Audio file to play using require(file_name)
 * @param setSoundPlayback Optional callback to save a reference to the audio player
 * @param options Options for playing the sound (expo-av style status fields, applied to the expo-audio player)
 */
export const playAudio = async (source: number, setSoundPlayback?: (player: AudioPlayer) => any, options?: PlaybackOptions, cache=true) => {
  const status = {
    ...defaultOptions,
    ...options
  };
  try {
    let player = cache ? cachedAudio.get(source) : undefined;
    if (player) {
      // expo-audio players stay paused at the end once finished, so rewind before replaying
      await player.seekTo(status.positionMillis / 1000);
    } else {
      player = createAudioPlayer(source);
      if (cache) {
        cachedAudio.set(source, player);
      } else {
        const uncachedPlayer = player;
        uncachedPlayer.addListener('playbackStatusUpdate', (playbackStatus) => {
          if (playbackStatus.didJustFinish && !playbackStatus.loop) uncachedPlayer.remove();
        });
      }
    }
    player.loop = status.isLooping;
    player.muted = status.isMuted;
    if (status.volume !== undefined) player.volume = status.volume;
    if (status.shouldPlay) player.play();
    if (setSoundPlayback) setSoundPlayback(player);
  } catch (err) {
    console.warn(err);
  }
};

export default playAudio;
