import Actions from './actionTypes';
import { SettingsPartialState } from './';

export const initSettings = (settings: SettingsPartialState) => ({
  type: Actions.INIT_SETTINGS,
  payload: settings,
});

export const toggleMusic = () => ({
  type: Actions.TOGGLE_MUSIC,
});

export const toggleSfx = () => ({
  type: Actions.TOGGLE_SFX,
});

export const toggleColorblind = () => ({
  type: Actions.TOGGLE_COLORBLIND,
});

export const completeLevel = (levelNum: number) => ({
  type: Actions.COMPLETE_LEVEL,
  payload: {
    levelNum
  },
});

export const unlockLevel = (levelNum: number) => ({
  type: Actions.UNLOCK_LEVEL,
  payload: {
    levelNum
  },
});
