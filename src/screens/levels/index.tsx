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
import LevelBalloon2 from './LevelBalloon2';
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
import LevelMonths from './LevelMonths';
import LevelVolcano from './LevelVolcano';
import LevelDraw12 from './LevelDraw12';
import LevelThreeCardMonte from './LevelThreeCardMonte';
import LevelFitSquares from './LevelFitSquares';
import LevelMatchCards from './LevelMatchCards';
import LevelMultiplyTo12 from './LevelMultiplyTo12';
import LevelA1Z26 from './LevelA1Z26';
import LevelPolygons from './LevelPolygons';
import LevelClockOrder from './LevelClockOrder';
import LevelCompass from './LevelCompass';
import LevelHoleJigsaw from './LevelHoleJigsaw';
import LevelDodecahedron from './LevelDodecahedron';
import LevelLandscape from './LevelLandscape';
import LevelWarning from './LevelWarning';
import LevelRace from './LevelRace';
import LevelRaceGE from './LevelRaceGE';
import LevelThreeStacks from './LevelThreeStacks';
import LevelStackQueue from './LevelStackQueue';
import LevelBallMaze from './LevelBallMaze';
import LevelAcyclicAddition from './LevelAcyclicAddition';
import LevelSearch from './LevelSearch';
import LevelD12 from './LevelD12';
import LevelSlidingPuzzle from './LevelSlidingPuzzle';
import LevelBalance from './LevelBalance';
import Level69 from './Level69';
import LevelRacecar from './LevelRacecar';
import LevelPlusFlip from './LevelPlusFlip';
import LevelProduct from './LevelProduct';
import Level12 from './Level12';




export default [
  LevelSelect,
  Level1,
  LevelSlider,
  LevelCatchCoins,
  LevelRedLight,
  LevelWindow,
  LevelScratchOff,
  LevelShrinkingCoin,
  LevelBinary0,
  LevelSimonSays,
  LevelArrows,
  LevelFloatingPoint,
  Level12,
  LevelSlideDown,
  LevelRGBSliders,
  LevelNewcomerCoin,
  LevelBipartiteCircuit,
  LevelMouseMaze,
  LevelRabbitHole,
  LevelClock,
  Level12Wire,
  LevelTeleportingCoin,
  LevelSimonDoesNotSay,
  LevelBinary1,
  LevelElevenPlusTwo,
  LevelZoomInCoin,
  LevelUpsideDown,
  LevelCMYSliders,
  LevelVolcano,
  LevelMonths,
  LevelPiano,
  LevelBinary2,
  LevelDraw12,
  LevelFitSquares,
  LevelMatchCards,
  LevelMultiplyTo12,
  LevelA1Z26,
  LevelClockOrder,
  LevelLandscape,
  LevelDodecahedron,
  LevelBalloon,
  LevelThreeStacks,
  LevelStackQueue,
  LevelBallMaze,
  LevelAcyclicAddition,
  LevelSearch,
  LevelSlidingPuzzle,
  LevelBalance,
  LevelPlusFlip,
  Level69,
  LevelWarning,
  LevelProduct,
  LevelD12,
  LevelRaceGE,
  LevelRace,
  LevelBalloon2,
  LevelCompass,
  LevelHoleJigsaw,
  LevelRacecar,
  LevelWarning,
  LevelWarning,
  LevelWarning,
  LevelWarning,
  LevelWarning,
  LevelWarning,
  LevelWarning,
  LevelWarning,
  LevelWarning,
  LevelWarning,
  Level69,
  LevelWarning,
  LevelWarning,
  LevelWarning,
  // LevelPolygons,
  // LevelThreeCardMonte,
  // LevelExpandingCoin,
] as [LevelSelectType, ...Array<Level>];

// TENTATIVE SCHEMA:
// level % 12 === 1: some basic twist to level 1
// level % 12 === 2: color-based level
// level % 12 === 3: animation-based level
// level % 12 === 4: something about red/blue coins
// level % 12 === 5: an odd structure
// ... others (unless I think of some other pattern)
// level % 12 === 0: a remix level
// binary levels should be on powers of two
// last 12 levels are "challenge" levels or meta levels
//   should include piano, binary2, settings-to-win, and "scavenger hunt" level
