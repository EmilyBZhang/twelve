// TODO: Consider https://github.com/expo/expo/issues/146 (comment by gkufera) or webview
// Also consider preloading all the audio and then resetting their positions back to 0, as per https://forums.expo.io/t/laggy-audio-on-multiple-plays/3169

import { Audio } from 'expo-av';
import { AVPlaybackSource, AVPlaybackStatus, AVPlaybackStatusToSet } from 'expo-av/build/AV';

import Actions from 'reducers/settings/actionTypes';
import { ReduxState } from 'reducers/store';

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

export const playAudioWithPreload = async (name: string, source: AVPlaybackSource, setSoundPlayback?: (res: any) => any, options?: AVPlaybackStatusToSet) => {
  // TODO: Make this function
  const initialStatus = {
    ...defaultOptions,
    ...options,
  }
};

export interface CreateAudioResult {
  sound: Audio.Sound;
  status: AVPlaybackStatus;
}

const cachedAudio = new Map<number, CreateAudioResult>();

/**
 * Play an audio file asynchronously.
 * 
 * @param source Audio file to play using require(file_name)
 * @param setSoundPlayback Optional callback to save a reference to the sound playback
 * @param options Options for playing the sound, as specified in the initialStatus param for Audio.Sound.createAsync()
 */
export const playAudio = async (source: number, setSoundPlayback?: (res: CreateAudioResult) => any, options?: AVPlaybackStatusToSet, cache=true) => {
  const status = {
    ...defaultOptions,
    ...options
  };
  try {
    let audioObject: CreateAudioResult;
    if (cache) {
      audioObject = cachedAudio.get(source) || await Audio.Sound.createAsync(source, status);
      if (!cachedAudio.has(source)) cachedAudio.set(source, audioObject);
      else await audioObject.sound.setStatusAsync(status);
    } else {
      audioObject = await Audio.Sound.createAsync(source, status);
    }
    await audioObject.sound.setStatusAsync(status);
    if (setSoundPlayback) {
      setSoundPlayback(audioObject);
      audioObject.sound.setOnPlaybackStatusUpdate(status => {
        const newAudioObject = { sound: audioObject.sound, status };
        setSoundPlayback(newAudioObject);
        if (cache) cachedAudio.set(source, newAudioObject);
      });
    }
    audioObject.sound.setOnPlaybackStatusUpdate(status => {
      const newAudioObject = { sound: audioObject.sound, status };
      if (setSoundPlayback) setSoundPlayback(newAudioObject);
      if (cache) cachedAudio.set(source, newAudioObject);
      // @ts-ignore
      else if (status.didJustFinish && !status.isLooping) audioObject.sound.unloadAsync();
    });
    // audioObject.sound.setOnPlaybackStatusUpdate(async (status) => {
    //   setSoundPlayback?({ sound: audioObject.sound, status });
    //   // @ts-ignore
    //   if (status.didJustFinish && !status.isLooping) {
    //     try {
    //       await audioObject.sound.unloadAsync();
    //     } catch (err) {
    //       console.warn(err + ' playAudio.tsx possible error #2');
    //     }
    //   }
    // });
  } catch (err) {
    console.warn(err);
  }
};

export default playAudio;
