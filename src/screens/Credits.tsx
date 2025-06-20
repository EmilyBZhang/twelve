// TODO: Make credits screen scroll slowly to the bottom
// IDEA: Make the links at the bottom of the credits each contained inside of a Coin

import React, { useCallback, useEffect } from 'react';
import { NavigationActions } from 'react-navigation';
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
  const finishGame = !!props.navigation.getParam('finishGame') || false;

  const goToMainMenu = useCallback(() => {
    props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'MainMenu'
    }));
  }, []);

  useEffect(() => {
    if (!finishGame) return;
    (async () => {
      try {
        if (await StoreReview.hasAction() && await StoreReview.isAvailableAsync()) {
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
