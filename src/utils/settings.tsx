// Probably return an object of settings along with a dispatch
// Look into reducers

// TODO: Look into making the errors print out individually instead of in catch statements.

import React, { useState } from 'react';
import { AsyncStorage } from 'react-native';

import levels from 'screens/levels';

type SettingsObject = {[setting: string]: any};

const defaultSettings = {
  musicMuted: false,
  sfxMuted: false,
  colorblind: false,
  levelStatus: levels.slice(1).map((_, index) => ({
    unlocked: index === 0,
    completed: false
  })),
  language: 'en'
} as SettingsObject;

/*
let settings = {...defaultSettings};

AsyncStorage.getAllKeys((err, keys) => {
  if (err) {
    console.warn(err);
    return;
  }
  const excludedKeys = keys ? (
    Object.keys(settings).filter(key => !(key in keys))
  ) : Object.keys(settings);
  AsyncStorage.multiSet(
    Object.keys(excludedKeys).map(key => [key, JSON.stringify(settings[key])])
  ).catch(err => console.warn(err));
  if (!keys) return;
  AsyncStorage.multiGet(keys, (err, stores) => {
    if (err) {
      console.warn(err);
      return;
    }
    if (!stores) return;
    stores.map((result, i, store) => {
      const [key, value] = store[i];
      settings[key] = JSON.parse(value);
    });
    console.log(settings);
  });
});

export const getSetting = (name: string) => {
  return settings[name];
};

export const getAllSettings = () => {
  return settings;
};

export const multiGetSettings = (names: Array<string>) => {
  return names.reduce((o, name) => {
    o[name] = settings[name];
    return o;
  }, {} as SettingsObject);
};

export const mergeSettings = (newSettings: SettingsObject) => {
  settings = {
    ...settings,
    newSettings
  };
  AsyncStorage.multiSet(
    Object.keys(newSettings).map(key => [key, JSON.stringify(newSettings[key])])
  ).catch(err => console.warn(err));
  return settings;
};
*/

export const setSetting = (name: string, val: any) => {
  AsyncStorage.setItem(
    name,
    JSON.stringify(val),
    err => err && console.warn(err)
  );
};

export const clearSettings = () => {
  // settings = defaultSettings;
  // AsyncStorage.multiRemove(Object.keys(settings));
  // return settings;
  AsyncStorage.multiRemove(Object.keys(defaultSettings), (err) => err && console.warn(err));
  console.log('Reset keys:\n', Object.keys(defaultSettings));
  return defaultSettings;
};

// export default getAllSettings;
