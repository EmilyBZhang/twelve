import { Platform } from 'react-native';

const strings = {
  urls: {
    github: 'https://github.com/BradonZhang/twelve',
    soundcloud: 'https://soundcloud.com/alan-dai-4'
  },
  generateShareMessage: (numLevelsCompleted: number) => (
    `I've solved ${numLevelsCompleted} level${
      (numLevelsCompleted === 1) ? '' : 's'
    } in Twelve! How many can you solve?${
      Platform.OS === 'android' ? ' https://expo.io/@bradonzhang/twelve' : ''
    }`
  ),
};

export default strings;
