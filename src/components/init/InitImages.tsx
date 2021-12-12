import { FunctionComponent, useEffect, memo } from 'react';
import { Asset } from 'expo-asset';

import { images } from 'res/assets';

interface InitImagesProps {
  onLoad: () => any;
}

const InitImages: FunctionComponent<InitImagesProps> = (props) => {
  const { onLoad } = props;

  useEffect(() => {
    Promise.all(
      Object.values(images).map(
        image => Asset.fromModule(image).downloadAsync()
      )
    ).then(() => onLoad()).catch(console.warn);
  }, []);
  
  return null;
};

export default memo(InitImages);
