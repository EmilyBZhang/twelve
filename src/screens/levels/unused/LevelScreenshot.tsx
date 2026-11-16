import React, { useState, useEffect } from 'react';
import { PermissionsAndroid, Alert } from 'react-native';
// import { addScreenshotListener, removeScreenshotListener } from 'expo-screen-capture';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import styles from 'res/styles';
import colors from 'res/colors';
import coinPositions from 'utils/coinPositions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const cameraSize = styles.coinSize * 5;

const CameraIcon = styled(MaterialCommunityIcons).attrs({
  name: 'camera',
  size: cameraSize,
  color: colors.darkText,
})``;

const LevelScreenshot: Level = (props) => {

  // TODO: Install expo-screen-capture for this to work
  // useEffect(() => {
  //   let subscription: { remove: () => void } | null = null;
  //   const addSubscription = async () => {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('yay')
  //       subscription = addScreenshotListener(() => {
  //         console.log('ouch!');
  //         Alert.alert('ouch!');
  //       });
  //     } else {
  //       console.log('boo')
  //     }
  //   }
  //   addSubscription();
  //   return () => subscription?.remove();
  // }, []);

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>Say cheese!</LevelText>
      <CameraIcon />
      {/* {coinPositions.map((coinPosition, index) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))} */}
    </LevelContainer>
  );
};

export default LevelScreenshot;
