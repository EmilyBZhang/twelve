// TODO: Consider https://github.com/expo/expo/issues/146 (comment by gkufera) or webview
// Also consider preloading all the audio and then resetting their positions back to 0, as per https://forums.expo.io/t/laggy-audio-on-multiple-plays/3169

import { Audio } from 'expo-av';
import { AVPlaybackSource, AVPlaybackStatus, AVPlaybackStatusToSet } from 'expo-av/build/AV';

import Actions from 'reducers/settings/actionTypes';
import { ReduxState } from 'reducers/store';

const defaultOptions = {
  shouldPlay: true,
  isLooping: false,
  isMuted: false
};

type MiddlewareArg = {getState: () => ReduxState};
type Action = {type: Actions, payload?: any};
type Next = (action: Action) => any;

export const changePlaybackOptions = ({ getState }: MiddlewareArg) => (
  (next: Next) => (action: Action) => {
    if (action.type === Actions.TOGGLE_SFX) {
      defaultOptions.isMuted = getState().settings.sfx;
    } else if (action.type === Actions.INIT_SETTINGS) {
      defaultOptions.isMuted = !action.payload.sfx || !getState().settings.sfx;
    }
    return next(action);
  }
);

export const playAudioWithPreload = async (name: string, source: AVPlaybackSource, setSoundPlayback?: (res: any) => any, options?: AVPlaybackStatusToSet) => {
  // TODO: Make this function
};

export interface CreateAudioResult {
  sound: Audio.Sound;
  status: AVPlaybackStatus;
}

/**
 * Play an audio file asynchronously.
 * 
 * @param source Audio file to play
 * @param setSoundPlayback Optional callback to save a reference to the sound playback
 * @param options Options for playing the sound, as specified in the initialStatus param for Audio.Sound.createAsync()
 */
export const playAudio = async (source: AVPlaybackSource, setSoundPlayback?: (res: CreateAudioResult) => any, options?: AVPlaybackStatusToSet) => {
  const initialStatus = {
    ...defaultOptions,
    ...options
  };
  try { 
    const audioObject = await Audio.Sound.createAsync(source, initialStatus);
    if (setSoundPlayback) setSoundPlayback(audioObject);
    const { sound, status } = audioObject;
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish && !initialStatus.isLooping) {
        try {
          await sound.unloadAsync();
        } catch (err) {
          console.warn(err + ' playAudio.tsx possible error #2');
        }
      }
    });
  } catch (err) {
    console.warn(err + ' playAudio.tsx possible error #1');
  }
};

export default playAudio;
