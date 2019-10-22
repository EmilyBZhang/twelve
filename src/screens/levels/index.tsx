import React, { FunctionComponent } from 'react';

import { Level } from 'utils/interfaces';
import LevelSelect, { LevelSelectType } from './LevelSelect';
import Level1 from './Level1';
import LevelSlider from './LevelSlider';
import LevelCatchCoins from './LevelCatchCoins';
import LevelRedLight from './LevelRedLight';
import LevelWindow from './LevelWindow';
import LevelSimonSays from './LevelSimonSays';
import LevelSimonDoesNotSay from './LevelSimonDoesNotSay';
import LevelArrows from './LevelArrows';
import LevelClock from './LevelClock';
import LevelNewcomerCoin from './LevelNewcomerCoin';
import LevelPiano from './LevelPiano';
import LevelBalloon from './LevelBalloon';
import LevelFloatingPoint from './LevelFloatingPoint';

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
  LevelClock,
  LevelSimonDoesNotSay,
  LevelPiano,
  LevelBalloon,
] as [LevelSelectType, ...Array<Level>];
