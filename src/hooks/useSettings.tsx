import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import * as actions from 'reducers/settings/actions';
import { SettingsState, SettingsPartialState } from 'reducers/settings';
import { ReduxState } from 'reducers/store';

type SettingsProps = Array<keyof SettingsState> | null;

const mapStateToProps = (state: ReduxState, settingsProps: SettingsProps) => {
  if (!settingsProps) return state.settings;
  return (
    settingsProps.reduce((obj, key) => {
        obj[key] = state.settings[key];
        return obj;
      }, {} as {[setting: string]: any}
    )
  );
};

const useSettings = (settingsProps = null as SettingsProps) => {
  const settings: SettingsPartialState = useSelector(
    (state: ReduxState) => mapStateToProps(state, settingsProps),
    shallowEqual
  );
  const dispatch = useDispatch();

  const dispatchActions = {
    initSettings: (settings: SettingsPartialState) => (
      dispatch(actions.initSettings(settings))
    ),
    toggleMusic: () => dispatch(actions.toggleMusic()),
    toggleSfx: () => dispatch(actions.toggleSfx()),
    toggleColorblind: () => dispatch(actions.toggleColorblind()),
    completeLevel: (levelNum: number) => (
      dispatch(actions.completeLevel(levelNum))
    ),
    unlockLevel: (levelNum: number) => (
      dispatch(actions.unlockLevel(levelNum))
    )
  };
  
  type SettingsHook = [SettingsState, typeof dispatchActions];
  return [settings, dispatchActions] as SettingsHook;
};

export default useSettings;
