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
import LevelRGBSliders from './LevelRGBSliders';
import LevelSlideDown from './LevelSlideDown';
import LevelSimonDoesNotSay from './LevelSimonDoesNotSay';
import LevelPiano from './LevelPiano';
import LevelBipartiteCircuit from './LevelBipartiteCircuit';
import LevelBinary1 from './LevelBinary1';
import LevelBinary2 from './LevelBinary2';
import LevelRabbitHole from './LevelRabbitHole';
import LevelBalloon from './LevelBalloon';
import LevelExpandingCoin from './LevelExpandingCoin';
import LevelScratchOff from './LevelScratchOff';
import Level12Wire from './Level12Wire';
import LevelShrinkingCoin from './LevelShrinkingCoin';
import LevelTeleportingCoin from './LevelTeleportingCoin';
import LevelZoomInCoin from './LevelZoomInCoin';
import LevelElevenPlusTwo from './LevelElevenPlusTwo';
import LevelCMYSliders from './LevelCMYSliders';
import LevelUpsideDown from './LevelUpsideDown';
import LevelBinary0 from './LevelBinary0';

export default [
  LevelSelect,
  // LevelExpandingCoin,
  Level1,
  LevelSlider,
  LevelCatchCoins,
  LevelRedLight,
  LevelWindow,
  LevelScratchOff,
  LevelShrinkingCoin,
  LevelSimonSays,
  LevelArrows,
  LevelBipartiteCircuit,
  LevelFloatingPoint,
  LevelMouseMaze,
  LevelSlideDown,
  LevelRGBSliders,
  LevelNewcomerCoin,
  LevelBinary1,
  LevelRabbitHole,
  LevelClock,
  Level12Wire,
  LevelTeleportingCoin,
  LevelSimonDoesNotSay,
  LevelPiano,
  LevelBinary2,
  LevelZoomInCoin,
  LevelUpsideDown,
  LevelCMYSliders,
  LevelElevenPlusTwo,
  LevelBinary0,
  // LevelBalloon,
] as [LevelSelectType, ...Array<Level>];
