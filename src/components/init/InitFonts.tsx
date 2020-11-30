import { FunctionComponent, useEffect, memo } from 'react';
import * as Font from 'expo-font';

interface InitFontsProps {
  onLoad: () => any;
}

const InitFonts: FunctionComponent<InitFontsProps> = (props) => {
  useEffect(() => {
    Font.loadAsync({
      'montserrat': require('assets/fonts/Montserrat-Regular.ttf'),
      'montserrat-bold': require('assets/fonts/Montserrat-Bold.ttf'),
      'montserrat-extra-bold': require('assets/fonts/Montserrat-ExtraBold.ttf'),
      'montserrat-black': require('assets/fonts/Montserrat-Black.ttf'),
    }).then(() => props.onLoad()).catch(console.warn);
  }, []);
  
  return null;
};

export default memo(InitFonts);
