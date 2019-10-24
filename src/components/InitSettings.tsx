import React, { FunctionComponent, useEffect } from 'react';
import { AsyncStorage } from 'react-native';

import useSettings from 'hooks/useSettings';
import { SettingsPartialState } from 'reducers/settings';
import levels from 'screens/levels';

const InitSettings: FunctionComponent = (props) => {
  const { initSettings } = useSettings()[1];

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
          settings[key] = JSON.parse(value);
        });

        // Prevent issues if new levels are added or old ones removed
        if ('levelStatus' in settings) {
          const numLevels = levels.length - 1;
          while (settings.levelStatus.length < numLevels) {
            settings.levelStatus.push({
              completed: false,
              unlocked: settings.levelStatus[settings.length - 1].completed
            })
          }
          if (settings.levelStatus.length > numLevels) {
            settings.levelStatus = settings.levelStatus.slice(0, numLevels);
          }
        }

        console.log('LOADED THESE SETTINGS:');
        console.log(settings);

        initSettings(settings as SettingsPartialState);
      });
    });
  }, []);
  
  return null;
};

export default InitSettings;
