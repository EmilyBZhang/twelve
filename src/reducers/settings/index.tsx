import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import { Language } from 'utils/types';
import Actions from './actionTypes';
import levels from 'screens/levels';
import { setSetting } from 'utils/settings';

export type SettingsState = {
  music: boolean;
  sfx: boolean;
  colorblind: boolean;
  levelStatus: Array<{
    unlocked: boolean;
    completed: boolean;
  }>;
  language: Language;
  settingsReady: boolean;
};

export type SettingsPartialState = {
  music?: boolean;
  sfx?: boolean;
  colorblind?: boolean;
  levelStatus?: Array<{
    unlocked: boolean;
    completed: boolean;
  }>;
  language?: Language;
};

const initialState = {
  music: true,
  sfx: true,
  colorblind: false,
  levelStatus: levels.slice(1).map((_, index) => ({
    unlocked: index === 0,
    completed: false,
  })),
  language: 'en',
  settingsReady: false,
} as SettingsState;

interface Action {
  type: Actions;
  payload: any;
}

const settings = (state = initialState, action: Action) => {
  switch (action.type) {
    case Actions.INIT_SETTINGS: {
      if (Constants.expoConfig?.version)
        setSetting('version', Constants.expoConfig.version);
      return {
        ...state,
        ...(action.payload as SettingsPartialState),
        settingsReady: true,
      };
    }
    case Actions.TOGGLE_MUSIC: {
      setSetting('music', !state.music);
      return {
        ...state,
        music: !state.music,
      };
    }
    case Actions.TOGGLE_SFX: {
      setSetting('sfx', !state.sfx);
      return {
        ...state,
        sfx: !state.sfx,
      };
    }
    case Actions.TOGGLE_COLORBLIND: {
      setSetting('colorblind', !state.colorblind);
      return {
        ...state,
        colorblind: !state.colorblind,
      };
    }
    case Actions.COMPLETE_LEVEL: {
      const index = action.payload.levelNum - 1;
      if (index >= state.levelStatus.length || index < 0) return state;
      const newLevelStatus = state.levelStatus.slice();
      newLevelStatus[index].unlocked = true;
      newLevelStatus[index].completed = true;
      if (index + 1 < newLevelStatus.length) {
        newLevelStatus[index + 1].unlocked = true;
      }
      setSetting('levelStatus', newLevelStatus);
      return {
        ...state,
        levelStatus: newLevelStatus,
      };
    }
    case Actions.UNLOCK_LEVEL: {
      const newLevelStatus = state.levelStatus.slice();
      const index = action.payload.levelNum - 1;
      newLevelStatus[index].unlocked = true;
      setSetting('levelStatus', newLevelStatus);
      return {
        ...state,
        levelStatus: newLevelStatus,
      };
    }
    default:
      return state;
  }
};

export default settings;
