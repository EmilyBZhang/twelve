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
import LevelSlideDown from './LevelSlideDown';
import LevelSimonDoesNotSay from './LevelSimonDoesNotSay';
import LevelPiano from './LevelPiano';
import LevelBipartiteCircuit from './LevelBipartiteCircuit';
import LevelBinary1 from './LevelBinary1';
import LevelBinary2 from './LevelBinary2';
import LevelRabbitHole from './LevelRabbitHole';
import LevelBalloon from './LevelBalloon';
import LevelScratchOff from './LevelScratchOff';
import Level12Wire from './Level12Wire';
import LevelShrinkingCoin from './LevelShrinkingCoin';
import LevelTeleportingCoin from './LevelTeleportingCoin';
import LevelZoomInCoin from './LevelZoomInCoin';
import LevelElevenPlusTwo from './LevelElevenPlusTwo';
import LevelUpsideDown from './LevelUpsideDown';
import LevelBinary0 from './LevelBinary0';
import LevelMonths from './LevelMonths';
import LevelVolcano from './LevelVolcano';
import LevelDraw12 from './LevelDraw12';
import LevelFitSquares from './LevelFitSquares';
import LevelMatchCards from './LevelMatchCards';
import LevelMultiplyTo12 from './LevelMultiplyTo12';
import LevelA1Z26 from './LevelA1Z26';
import LevelClockOrder from './LevelClockOrder';
import LevelHoleJigsaw from './LevelHoleJigsaw';
import LevelLandscape from './LevelLandscape';
import LevelThreeStacks from './LevelThreeStacks';
import LevelStackQueue from './LevelStackQueue';
import LevelBallMaze from './LevelBallMaze';
import LevelAcyclicAddition from './LevelAcyclicAddition';
import LevelSearch from './LevelSearch';
import LevelSlidingPuzzle from './LevelSlidingPuzzle';
import LevelBalance from './LevelBalance';
import Level69 from './Level69';
import LevelRacecar from './LevelRacecar';
import LevelPlusFlip from './LevelPlusFlip';
import Level12 from './Level12';
import LevelPermuteTwoTwelves from './LevelPermuteTwoTwelves';
import LevelScavengerHunt from './LevelScavengerHunt';
import LevelWordSearch from './LevelWordSearch';
import LevelSodaShake from './LevelSodaShake';
import LevelPulley from './LevelPulley';
import LevelSettingsWin from './LevelSettingsWin';
import LevelThreeMagicButtons from './LevelThreeMagicButtons';
import LevelFadeOut from './LevelFadeOut';
import LevelSelfTimer from './LevelSelfTimer';
import LevelPrismDimensions from './LevelPrismDimensions';
import LevelSettingsToggle from './LevelSettingsToggle';
import LevelSodaDeviceShake from './LevelSodaDeviceShake';
import LevelConveyorBelt from './LevelConveyorBelt';
import LevelCredits from './LevelCredits';
import LevelClockPointer from './LevelClockPointer';
import LevelDialpad from './LevelDialpad';
import LevelSeaOfTwelves from './LevelSeaOfTwelves';
import LevelCircuit from './LevelCircuit';
import LevelHamiltonianPath from './LevelHamiltonianPath';
import LevelHamiltonianGrid from './LevelHamiltonianGrid';
import LevelEulerPath from './LevelEulerPath';
import LevelAd from './LevelAd';
import LevelSpellTwelve from './LevelSpellTwelve';
import LevelDodecahedron from './LevelDodecahedron';

`



This
string
lets
levels

align
to
their
position

in
level
order!



`;

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
  LevelArrows, // IMPROVE: consider randomizing arrows
  LevelFloatingPoint,
  LevelElevenPlusTwo,
  Level12,
  LevelSlideDown,
  LevelSimonSays,
  LevelTeleportingCoin,
  LevelBipartiteCircuit,
  LevelClock,
  LevelMatchCards, // IMPROVE: improve look
  LevelSelfTimer,
  LevelPlusFlip,
  LevelMouseMaze, // IMPROVE: move counter to mouse
  Level12Wire,
  LevelMultiplyTo12,
  LevelSettingsWin,
  LevelRabbitHole,
  LevelSpellTwelve,
  LevelZoomInCoin,
  LevelMonths, // IMPROVE: consider adding leap year (29) and adding current year label
  LevelSodaShake,
  LevelHoleJigsaw,
  LevelThreeStacks,
  LevelBinary1,
  LevelDodecahedron, // TODO: Add back LevelDodecahedron once we rewrite with https://docs.pmnd.rs/react-three-fiber/getting-started/installation
  LevelDraw12,
  LevelClockOrder,
  LevelConveyorBelt,
  LevelFadeOut,
  LevelSimonDoesNotSay,
  LevelSearch,
  LevelVolcano,
  LevelPulley,
  LevelWordSearch,
  LevelBalloon, // IMPROVE: update assets
  LevelAcyclicAddition,
  LevelHamiltonianGrid,
  LevelPrismDimensions,
  LevelThreeMagicButtons,
  LevelCircuit,
  LevelUpsideDown, // IMPROVE: check if sensor is working
  LevelBalance,
  LevelNewcomerCoin,
  LevelA1Z26, // IMPROVE: fix 'overflow' issue for last ticker
  LevelClockPointer,
  LevelDialpad,
  LevelStackQueue,
  LevelLandscape,
  LevelEulerPath,
  LevelFitSquares, // IMPROVE: eliminate race condition
  LevelPermuteTwoTwelves,
  LevelSettingsToggle, // IMPROVE: put settings icons on coins
  LevelSeaOfTwelves,
  LevelBallMaze,
  LevelRacecar,
  LevelBinary2,
  LevelSodaDeviceShake,
  LevelSlidingPuzzle,
  LevelPiano,
  LevelHamiltonianPath,
  Level69,
  LevelAd,
  LevelCredits,
  LevelScavengerHunt, // IMPROVE: Automatically move to next textbox
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
// Fix screen for iPhones with notches
// Redesign main menu
// Figure out in-app purchases
// Possibly fix audio for Android by preloading assets
// Look into preloading image assets
// Add speedrun timers
