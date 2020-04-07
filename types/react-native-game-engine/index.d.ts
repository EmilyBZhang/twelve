import * as RNGE from 'react-native-game-engine';

declare module 'react-native-game-engine' {

  export type TouchEventName = 'start' | 'end' | 'move' | 'press' | 'long-press';

  export interface GameEvent {
    type: string;
    [prop: string]: any;
  }

  export type Entities = {[id: string]: {[prop: string]: any}};

  export interface ScreenProps {
    fontScale: number;
    height: number;
    scale: number;
    width: number;
  }

  export interface TimeProps {
    current: number;
    delta: number;
    previous: number;
    previousDelta: number;
  }

  export interface TouchEvent {
    event: {
      changedTouches: Array<TouchEvent>;
      identifier: number;
      locationX: number;
      locationY: number;
      pageX: number;
      pageY: number;
      target: number;
      timestamp: number;
      touches: Array<TouchEvent>;
    };
    id: number;
    type: TouchEventName;
    delta?: {
      locationX: number;
      locationY: number;
      pageX: number;
      pageY: number;
      timestamp: number;
    }
  }

  export interface Actions {
    dispatch: (event: GameEvent) => any;
    events: Array<GameEvent>;
    screen: ScreenProps;
    time: TimeProps;
    touches: Array<TouchEvent>;
  }

  export type System = (entities: Entities, actions: Actions) => Entities;
}