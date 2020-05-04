import * as RNGE from 'react-native-game-engine';
import { ScaledSize } from 'react-native';

declare module 'react-native-game-engine' {

  export type TouchEventName = 'start' | 'end' | 'move' | 'press' | 'long-press';

  export interface GameEvent {
    type: string;
    [prop: string]: any;
  }

  export type Entities = {[id: string]: {[prop: string]: any}};

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

  export interface GameEngineUpdate {
    dispatch: (event: GameEvent) => void;
    events: Array<GameEvent>;
    screen: ScaledSize;
    time: TimeProps;
    touches: Array<TouchEvent>;
  }

  export interface GameLoopUpdate {
    touches: Array<TouchEvent>;
    screen: ScaledSize;
    time: {
      current: number;
      previous: number;
      delta: number;
      previousDelta: number;
    };
  }

  export type System = (entities: Entities, update: GameEngineUpdate) => Entities;
}