import { Level } from 'utils/interfaces';
import LevelSelect, { LevelSelectType } from './LevelSelect';

import Level1 from './Level1';
import LevelSlider from './LevelSlider';
import LevelCatchCoins from './LevelCatchCoins';
import LevelRedLight from './LevelRedLight';
import LevelWindow from './LevelWindow';
import LevelSimonSays from './LevelSimonSays';
import LevelArrows from './LevelArrows';
import LevelFloatingPoint from './LevelFloatingPoint';
import LevelNewcomerCoin from './LevelNewcomerCoin';
import LevelMouseMaze from './LevelMouseMaze';
import LevelClock from './LevelClock';
import LevelTwoSliders from './LevelTwoSliders';
import LevelSlideDown from './LevelSlideDown';
import LevelSimonDoesNotSay from './LevelSimonDoesNotSay';
import LevelPiano from './LevelPiano';
import LevelBipartiteCircuit from './LevelBipartiteCircuit';
import LevelBinary1 from './LevelBinary1';
import LevelBinary2 from './LevelBinary2';
import LevelBalloon from './LevelBalloon';

export default [
  LevelSelect,
  Level1,
  LevelSlider,
  LevelCatchCoins,
  LevelRedLight,
  LevelWindow,
  LevelSimonSays,
  LevelArrows,
  LevelBipartiteCircuit,
  LevelFloatingPoint,
  LevelNewcomerCoin,
  LevelMouseMaze,
  LevelBinary1,
  LevelClock,
  LevelSlideDown,
  LevelTwoSliders,
  LevelSimonDoesNotSay,
  LevelPiano,
  LevelBinary2,
  LevelBalloon,
] as [LevelSelectType, ...Array<Level>];
