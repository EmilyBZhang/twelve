import { FunctionComponent, useEffect, memo } from 'react';
import * as Font from 'expo-font';
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  Octicons,
  MaterialIcons,
  Foundation,
} from '@expo/vector-icons';

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
      ...AntDesign.font,
      ...MaterialCommunityIcons.font,
      ...FontAwesome.font,
      ...FontAwesome5.font,
      ...Octicons.font,
      ...MaterialIcons.font,
      ...Foundation.font,
    }).then(() => props.onLoad()).catch(console.warn);
  }, []);
  
  return null;
};

export default memo(InitFonts);
