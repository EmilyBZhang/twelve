import { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import { NavigationScreenProp } from 'react-navigation';

export interface ScreenProps {
  navigation: NavigationScreenProp<any>;
};

export interface LevelProps {
  levelNum: number;
  coinsFound: Set<number>;
  onCoinPress: (index?: number) => void;
  setCoinsFound: (indices?: Set<number>) => void;
  onNextLevel: () => any;
  setSettingsOpen: (settingsOpen: boolean) => any;
  navigation: NavigationScreenProp<any>;
}

export type Screen = FunctionComponent<ScreenProps>;
export type Level = FunctionComponent<LevelProps>;

export type Subscription = {
  remove: () => void;
};
