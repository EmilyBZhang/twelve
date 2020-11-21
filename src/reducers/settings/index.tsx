import { AsyncStorage } from 'react-native';

import { Language } from 'utils/types';
import Actions from './actionTypes';
// MARK: This may cause require cycles
import levels from 'screens/levels';
import { setSetting } from 'utils/settings';

export type SettingsState = {
  musicMuted: boolean;
  sfxMuted: boolean;
  colorblind: boolean;
  levelStatus: Array<{
    unlocked: boolean;
    completed: boolean;
  }>;
  language: Language;
  settingsReady: boolean;
};

export type SettingsPartialState = {
  musicMuted?: boolean;
  sfxMuted?: boolean;
  colorblind?: boolean;
  levelStatus?: Array<{
    unlocked: boolean;
    completed: boolean;
  }>;
  language?: Language;
};

const initialState = {
  musicMuted: false,
  sfxMuted: false,
  colorblind: false,
  levelStatus: levels.slice(1).map((_, index) => ({
    unlocked: index === 0,
    completed: false
  })),
  language: 'en',
  settingsReady: false
} as SettingsState;

interface Action {
  type: Actions;
  payload: any;
}

const settings = (state = initialState, action: Action) => {
  switch (action.type) {
    case Actions.INIT_SETTINGS: {
      return ({
        ...state,
        ...action.payload as SettingsPartialState,
        settingsReady: true
      });
    }
    case Actions.TOGGLE_MUSIC: {
      setSetting('musicMuted', !state.musicMuted);
      return ({
        ...state,
        musicMuted: !state.musicMuted
      });
    }
    case Actions.TOGGLE_SFX: {
      setSetting('sfxMuted', !state.sfxMuted);
      return ({
        ...state,
        sfxMuted: !state.sfxMuted
      });
    }
    case Actions.TOGGLE_COLORBLIND: {
      setSetting('colorblind', !state.colorblind);
      return ({
        ...state,
        colorblind: !state.colorblind
      });
    }
    case Actions.COMPLETE_LEVEL: {
      const index = action.payload.levelNum - 1;
      if (index >= state.levelStatus.length) return state;
      const newLevelStatus = state.levelStatus.slice();
      newLevelStatus[index].unlocked = true;
      newLevelStatus[index].completed = true;
      if (index + 1 < newLevelStatus.length) {
        newLevelStatus[index + 1].unlocked = true;
      }
      setSetting('levelStatus', newLevelStatus);
      return ({
        ...state,
        levelStatus: newLevelStatus
      });
    }
    case Actions.UNLOCK_LEVEL: {
      const newLevelStatus = state.levelStatus.slice();
      const index = action.payload.levelNum - 1;
      newLevelStatus[index].unlocked = true;
      setSetting('levelStatus', newLevelStatus);
      return ({
        ...state,
        levelStatus: newLevelStatus
      });
    }
    default:
      return state;
  }
};

export default settings;
