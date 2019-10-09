import { FunctionComponent, PropsWithChildren, ReactElement } from 'react';
import { NavigationScreenOptions } from 'react-navigation';

export interface Screen<T = {}> extends FunctionComponent {
  // Maybe fix? Getting implicit any warning for MainMenu
  (props: PropsWithChildren<T> | {navigation: any}, context?: any): ReactElement | null;
  // navigationOptions: ((...args: any[]) => NavigationScreenOptions)
};

export interface Level {
  coinsFound: Set<number>;
  onCoinPress: (index: number) => void;
  onGoToLevel?: (index: number) => any;
}
