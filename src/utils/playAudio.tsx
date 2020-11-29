// TODO: Consider https://github.com/expo/expo/issues/146 (comment by gkufera) or webview
// Also consider preloading all the audio and then resetting their positions back to 0, as per https://forums.expo.io/t/laggy-audio-on-multiple-plays/3169

import { Audio } from 'expo-av';
import { AVPlaybackSource, AVPlaybackStatusToSet } from 'expo-av/build/AV';

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
      defaultOptions.isMuted = action.payload.sfx || getState().settings.sfx;
    }
    return next(action);
  }
);

export const playAudioWithPreload = async (name: string, sound: AVPlaybackSource, setSoundPlayback?: (res: any) => any, options?: AVPlaybackStatusToSet) => {
  // TODO: Make this function
};

/**
 * Play an audio file asynchronously.
 * 
 * @param sound Audio file to play
 * @param setSoundPlayback Optional callback to save a reference to the sound playback
 * @param options Options for playing the sound, as specified in the initialStatus param for Audio.Sound.createAsync()
 */
export const playAudio = async (sound: AVPlaybackSource, setSoundPlayback?: (res: any) => any, options?: AVPlaybackStatusToSet) => {
  const initialStatus = {
    ...defaultOptions,
    ...options
  };
  Audio.Sound.createAsync(
    sound,
    initialStatus
  ).then(res => {
    res.sound.setOnPlaybackStatusUpdate(status => {
      // @ts-ignore
      if (!status.didJustFinish) {
        if (setSoundPlayback) setSoundPlayback(res);
        return;
      };
      if (!initialStatus.isLooping) {
        res.sound.unloadAsync().catch((err: any) => console.warn(err + ' CTRL-SHIFT-F UNLOADASYNCERROR'));
      }
    });
  }).catch(err => console.warn(err + ' CTRL-SHIFT-F AUDIOCREATEASYNCERROR'));
};

export default playAudio;
