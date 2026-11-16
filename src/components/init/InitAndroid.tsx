import { FunctionComponent, useEffect, memo } from 'react';
import { NavigationBar } from 'expo-navigation-bar';

interface InitAndroidProps {
  onLoad: () => any;
}

const InitAndroid: FunctionComponent<InitAndroidProps> = (props) => {
  const { onLoad } = props;

  useEffect(() => {
    try {
      NavigationBar.setHidden(true);
    } catch (err) {
      console.warn(err);
    }
    onLoad();
  }, []);

  return null;
};

export default memo(InitAndroid);
