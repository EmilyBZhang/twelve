// TODO: Consider https://github.com/expo/expo/issues/146 (comment by gkufera) or webview
// Also consider preloading all the audio and then resetting their positions back to 0, as per https://forums.expo.io/t/laggy-audio-on-multiple-plays/3169

import { Audio } from 'expo-av';
import { PlaybackSource, PlaybackStatusToSet } from 'expo-av/build/AV';

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
      defaultOptions.isMuted = !getState().settings.sfxMuted;
    } else if (action.type === Actions.INIT_SETTINGS) {
      defaultOptions.isMuted = action.payload.sfxMuted || getState().settings.sfxMuted;
    }
    return next(action);
  }
);

const playAudio = async (sound: PlaybackSource, setMusicPlayback?: (res: any) => any, options?: PlaybackStatusToSet) => {
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
        if (setMusicPlayback) setMusicPlayback(res);
        return;
      };
      if (!initialStatus.isLooping) {
        res.sound.unloadAsync().catch((err: any) => console.warn(err + ' line 20'));
      }
    });
  }).catch(err => console.warn(err + ' line 22'));
};

export default playAudio;
