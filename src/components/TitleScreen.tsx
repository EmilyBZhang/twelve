// TODO: Find image dimensions such that it matches the title font size

import React, { FunctionComponent, memo } from 'react';
import styled from 'styled-components/native';

import LevelContainer from 'components/LevelContainer';
import getDimensions from 'utils/getDimensions';

const { width: windowWidth } = getDimensions();

const imageHeight = windowWidth * 81 / 790;

const TitleImage = styled.Image.attrs({
  source: require('assets/images/twelve-padded-title.png'),
  resizeMode: 'contain'
})`
  width: ${windowWidth};
  height: ${imageHeight};
`;

const TitleScreen: FunctionComponent = () => (
  <LevelContainer>
    <TitleImage />
  </LevelContainer>
);

export default memo(TitleScreen);
