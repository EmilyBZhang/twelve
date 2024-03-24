import { FunctionComponent, useEffect, memo } from 'react';
import { setBehaviorAsync, setVisibilityAsync } from 'expo-navigation-bar';

interface InitAndroidProps {
  onLoad: () => any;
}

const InitAndroid: FunctionComponent<InitAndroidProps> = (props) => {
  const { onLoad } = props;

  useEffect(() => {
    Promise.all([
      setBehaviorAsync('overlay-swipe'),
      setVisibilityAsync('hidden'),
    ])
      .catch(console.warn)
      .finally(() => onLoad());
  }, []);

  return null;
};

export default memo(InitAndroid);
