import { FunctionComponent, useEffect, memo } from 'react';
import { Asset } from 'expo-asset';

import { music, sfx } from 'res/assets';

interface InitAudioProps {
  onLoad: () => any;
}

const InitAudio: FunctionComponent<InitAudioProps> = (props) => {
  const { onLoad } = props;

  useEffect(() => {
    Promise.all(Object.values({ ...music, ...sfx })
      .map(source => Asset.fromModule(source).downloadAsync())
    ).catch(console.warn).finally(() => onLoad());
  }, []);
  
  return null;
};

export default memo(InitAudio);
