import { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';

export interface ScreenProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

export interface LevelProps {
  levelNum: number;
  coinsFound: Set<number>;
  onCoinPress: (index?: number) => void;
  setCoinsFound: (indices?: Set<number>) => void;
  onNextLevel: () => any;
  setSettingsOpen: (settingsOpen: boolean) => any;
  setHintOpen: (hintOpen: boolean) => any;
  navigation: NavigationProp<any>;
}

export type Screen = FunctionComponent<ScreenProps>;
export type Level = FunctionComponent<LevelProps>;

export type Subscription = {
  remove: () => void;
};
