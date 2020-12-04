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
// import LevelDodecahedronGraphicsView from './LevelDodecahedronGraphicsView';
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
import LevelPermuteTwoTwelves from './LevelPermuteTwoTwelves';
import LevelScavengerHunt from './LevelScavengerHunt';
import LevelWordSearch from './LevelWordSearch';
import LevelSoda from './LevelSoda';
import LevelPulley from './LevelPulley';
import LevelSettingsWin from './LevelSettingsWin';
import LevelThreeMagicButtons from './LevelThreeMagicButtons';
import LevelFadeOut from './LevelFadeOut';
import LevelSelfTimer from './LevelSelfTimer';
// import LevelOctahedron from './LevelOctahedron';
import LevelPrismDimensions from './LevelPrismDimensions';
import LevelSettingsToggle from './LevelSettingsToggle';
import LevelScreenshot from './LevelScreenshot';
import LevelShake from './LevelShake';
import LevelConveyorBelt from './LevelConveyorBelt';
import LevelTest from './LevelTest';
import LevelClockPointer from './LevelClockPointer';
import LevelDialpad from './LevelDialpad';
import LevelSeaOfTwelves from './LevelSeaOfTwelves';
import LevelCircuit from './LevelCircuit';





export default [
  LevelSelect,
  Level1,
  LevelSlider, // IMPROVE: always start at 0
  LevelCatchCoins,
  LevelRedLight,
  LevelWindow,
  LevelScratchOff, // IMPROVE: eliminate loading time if possible
  LevelShrinkingCoin,
  LevelBinary0,
  LevelSimonSays, // IMPROVE: keep pattern consistent after failing
  LevelArrows, // IMPROVE: consider randomizing arrows
  LevelFloatingPoint,
  Level12,
  LevelSlideDown, // IMPROVE: change level text to be 'twelve' but slanted
  LevelRGBSliders, // IMPROVE: possibly remove level
  LevelNewcomerCoin,
  LevelBipartiteCircuit, // IMPROVE: add bit labels
  LevelMouseMaze, // IMPROVE: move counter to mouse
  LevelRabbitHole,
  LevelClock,
  Level12Wire,
  LevelTeleportingCoin,
  LevelSimonDoesNotSay, // IMPROVE: guarantee "not says" is half (via shuffling)
  LevelBinary1, // IMPROVE: add bit labels
  LevelElevenPlusTwo, // IMPROVE: allow twelve + one
  LevelZoomInCoin,
  LevelUpsideDown,
  LevelCMYSliders,
  LevelVolcano, // IMPROVE: update asset
  LevelMonths, // IMPROVE: consider adding leap year (29) and adding current year label
  LevelPiano, // IMPROVE: update asset
  LevelBinary2, // IMPROVE: add bit labels
  LevelDraw12,
  LevelFitSquares, // IMPROVE: eliminate race condition
  LevelMatchCards, // IMPROVE: improve look
  LevelMultiplyTo12,
  LevelA1Z26, // IMPROVE: fix 'overflow' issue for last ticker
  LevelClockOrder,
  LevelLandscape, // IMPROVE: update asset
  LevelDodecahedron,
  LevelBalloon, // IMPROVE: update assets
  LevelThreeStacks, // IMPROVE: change to single-press
  LevelStackQueue,
  LevelBallMaze,
  LevelAcyclicAddition,
  LevelSearch,
  LevelSlidingPuzzle,
  LevelBalance,
  LevelPlusFlip,
  LevelPermuteTwoTwelves,
  LevelWordSearch,
  LevelHoleJigsaw, // IMPROVE: add assets to jigsaw pieces
  LevelPulley,
  LevelSettingsWin, // IMPROVE: add icon to switch
  LevelThreeMagicButtons,
  LevelFadeOut,
  LevelSelfTimer,
  LevelSettingsToggle, // IMPROVE: put settings icons on coins
  LevelClockPointer,
  LevelDialpad, // IMPROVE: Give progress meter
  LevelSeaOfTwelves,
  LevelPrismDimensions,
  LevelWarning,
  LevelConveyorBelt,
  LevelShake,
  // LevelOctahedron,
  LevelRacecar,
  LevelSoda,
  LevelTest,
  LevelCircuit,
  LevelWarning,
  Level69, // IMPROVE: fix position
  LevelWarning,
  LevelWarning,
  LevelScavengerHunt,
  // bowling
  // 12 in picture
  // ad
  // light bulb
  // neighbor coins fade away
  // 12:12
  // Falling letters twelve
  // Circular formation: number on each coin denotes distance from next coin
  // Square formation of coins
  /*
  OOOO
  O  O
  O  O
  OOOO
  */

  // LevelScreenshot,
  // LevelProduct,
  // LevelD12,
  // LevelRaceGE,
  // LevelRace,
  // LevelBalloon2,
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

// GENERAL TODO:
// Add hints
// Fix screen for iPhones with notches
// Redesign main menu
// Figure out in-app purchases
// Possibly fix audio for Android by preloading assets
// Look into preloading image assets
// Add speedrun timers
