import { FunctionComponent, useEffect, memo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useSettings from 'hooks/useSettings';
import { SettingsPartialState } from 'reducers/settings';
import levels from 'screens/levels';

interface InitSettingsProps {
  onLoad: () => any;
}

const InitSettings: FunctionComponent<InitSettingsProps> = (props) => {
  const [{ settingsReady }, { initSettings }] = useSettings(['settingsReady']);

  useEffect(() => {
    AsyncStorage.getAllKeys((err, keys) => {
      if (err) console.warn(err);
      if (!keys) return;

      AsyncStorage.multiGet(keys, (err, stores) => {
        if (err) console.warn(err);
        if (!stores) return;

        const settings = {} as {[key: string]: any};

        stores.forEach((store) => {
          const [key, value] = store;
          settings[key] = JSON.parse(String(value));
        });

        // Prevent issues if new levels are added or old ones removed
        if ('levelStatus' in settings) {
          const numLevels = levels.length - 1;
          const numSaved = settings.levelStatus.length;

          if (numSaved > numLevels) {
            settings.levelStatus = settings.levelStatus.slice(0, numLevels);
          } else if (numSaved < numLevels) {
            const remainingLevels = Array(numLevels - numSaved)
              .fill({
                completed: false,
                unlocked: false
              });
            remainingLevels[0].unlocked = (
              settings.levelStatus[numSaved - 1].completed
            );
            settings.levelStatus.push(...remainingLevels);
          }
        }

        console.log('LOADED THESE SETTINGS:');
        console.log(settings);

        initSettings(settings as SettingsPartialState);
      });
    });
  }, []);

  useEffect(() => {
    if (settingsReady) props.onLoad();
  }, [settingsReady]);
  
  return null;
};

export default memo(InitSettings);
