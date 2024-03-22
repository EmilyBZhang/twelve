import { Platform } from 'react-native';


const iosUrl = 'https://apps.apple.com/us/app/twelve-a-puzzle-game/id1545782494';
const androidUrl = 'https://play.google.com/store/apps/details?id=com.bradonzhang.twelve';

const strings = {
  urls: {
    github: 'https://github.com/BradonZhang/twelve',
    soundcloud: 'https://soundcloud.com/alan-dai-4',
    youtube: 'https://www.youtube.com/channel/UCAsBq_Z2WhRYgBEH8vDlEQg',
  },
  generateShareMessage: (numLevelsCompleted: number) => (
    `I've solved ${numLevelsCompleted} level${
      (numLevelsCompleted === 1) ? '' : 's'
    } in Twelve! How many can you solve? ${
      Platform.OS === 'android' ? androidUrl : iosUrl
    }`
  ),
};

export default strings;
