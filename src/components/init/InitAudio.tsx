import { FunctionComponent, useEffect, memo } from 'react';
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { setAudioModeAsync } from 'expo-audio';

import { music, sfx } from 'res/assets';

interface InitAudioProps {
  onLoad: () => any;
}

const InitAudio: FunctionComponent<InitAudioProps> = (props) => {
  const { onLoad } = props;

  useEffect(() => {
    Promise.all([
      // Respect the iOS silent switch, as expo-av did by default
      setAudioModeAsync({ playsInSilentMode: Platform.OS !== 'ios' }),
      ...Object.values({ ...music, ...sfx })
        .map(source => Asset.fromModule(source).downloadAsync()),
    ]).catch(console.warn).finally(() => onLoad());
  }, []);
  
  return null;
};

export default memo(InitAudio);
