// TODO: Consider https://github.com/expo/expo/issues/146 (comment by gkufera) or webview
// Also consider preloading all the audio and then resetting their positions back to 0, as per https://forums.expo.io/t/laggy-audio-on-multiple-plays/3169

import { Audio } from 'expo-av';

const defaultOptions = {
  shouldPlay: true,
  isLooping: false,
  isMuted: false
};

const playAudio = async (sound: any, setMusicPlayback?: (res: any) => any, options = defaultOptions) => {
  Audio.Sound.createAsync(
    sound,
    options
  ).then(res => {
    res.sound.setOnPlaybackStatusUpdate(status => {
      // @ts-ignore
      if (!status.didJustFinish) {
        if (setMusicPlayback) setMusicPlayback(res);
        return;
      };
      if (!options.isLooping) res.sound.unloadAsync().catch((err: any) => console.warn(err + ' line 20'));
    });
  }).catch(err => console.warn(err + ' line 22'));
};

export default playAudio;
