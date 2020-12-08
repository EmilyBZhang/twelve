// TODO: Make credits screen scroll slowly to the bottom
// IDEA: Make the links at the bottom of the credits each contained inside of a Coin

import React, { useCallback } from 'react';
import { NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';

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
  const animateBg = !!props.navigation.getParam('animateBg') || false;

  const goToMainMenu = useCallback(() => {
    props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'MainMenu'
    }));
  }, []);

  return (
    <ScreenContainer>
      <LevelNav onBack={goToMainMenu} />
      <FallingCoinsContainer>
        <FallingCoins active={animateBg} />
      </FallingCoinsContainer>
      <CreditsFlatList />
    </ScreenContainer>
  );
};

export default Credits;
