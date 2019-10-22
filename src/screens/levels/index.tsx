import React, { FunctionComponent } from 'react';

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
import LevelClock from './LevelClock';
import LevelMouseMaze from './LevelMouseMaze';
import LevelSimonDoesNotSay from './LevelSimonDoesNotSay';
import LevelPiano from './LevelPiano';
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
  LevelFloatingPoint,
  LevelNewcomerCoin,
  LevelMouseMaze,
  LevelClock,
  LevelSimonDoesNotSay,
  LevelPiano,
  LevelBalloon,
] as [LevelSelectType, ...Array<Level>];
