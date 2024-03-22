// TODO: Make credits screen scroll slowly to the bottom
// IDEA: Make the links at the bottom of the credits each contained inside of a Coin

import React, { useCallback, useEffect } from 'react';
import { StackActions, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import * as StoreReview from 'expo-store-review';

import { Screen } from 'utils/interfaces';
import ScreenContainer from 'components/ScreenContainer';
import LevelNav from 'components/LevelNav';
import FallingCoins from 'components/FallingCoins';
import CreditsFlatList from 'components/CreditsFlatList';

const FallingCoinsContainer = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: -1;
`;

const Credits: Screen = (props) => {
  const route = useRoute();
  const finishGame =
    (route.params as { finishGame: boolean } | undefined)?.finishGame ?? false;

  const goToMainMenu = useCallback(() => {
    props.navigation.dispatch(StackActions.replace('MainMenu'));
  }, []);

  useEffect(() => {
    if (!finishGame) return;
    (async () => {
      try {
        if (
          (await StoreReview.hasAction()) &&
          (await StoreReview.isAvailableAsync())
        ) {
          StoreReview.requestReview();
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [finishGame]);

  return (
    <ScreenContainer>
      <LevelNav onBack={goToMainMenu} />
      <FallingCoinsContainer>
        <FallingCoins active={finishGame} />
      </FallingCoinsContainer>
      <CreditsFlatList />
    </ScreenContainer>
  );
};

export default Credits;
