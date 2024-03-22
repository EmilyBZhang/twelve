// TODO: Make credits screen scroll slowly to the bottom
// TODO: Get rid of hard-coded pixel values
// IDEA: Make the links at the bottom of the credits each contained inside of a Coin

import React, {
  FunctionComponent,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import { FlatList, Linking, Animated, Easing } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styled from 'styled-components/native';

import credits from 'assets/info/credits.json';
import colors from 'res/colors';
import styles from 'res/styles';
import strings from 'res/strings';
import { Screen } from 'utils/interfaces';
import getDimensions from 'utils/getDimensions';
import ScreenContainer from 'components/ScreenContainer';
import LevelNav from 'components/LevelNav';
import FallingCoins from 'components/FallingCoins';

const { width: windowWidth, height: windowHeight } = getDimensions();

const smallMarginSize = styles.coinSize / 3;

const FallingCoinsContainer = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: -1;
`;

const TitleText = styled.Text`
  width: 100%;
  text-align: center;
  font-size: ${styles.coinSize}px;
  font-family: montserrat-extra-bold;
  color: ${colors.foreground};
  margin-top: ${styles.levelNavHeight}px;
  margin-bottom: ${smallMarginSize}px;
`;

interface SectionProps {
  small?: boolean;
}

const SectionContainer = styled.View<SectionProps>`
  width: 100%;
  margin-top: ${(props) => smallMarginSize / (props.small ? 4 : 1)}px;
  margin-bottom: ${(props) => smallMarginSize / (props.small ? 4 : 1)}px;
`;

const SectionHeader = styled.Text`
  width: 100%;
  text-align: center;
  font-size: ${styles.coinSize / 2}px;
  font-family: montserrat-bold;
  color: black;
`;

const SectionSubheader = styled.Text`
  width: 100%;
  text-align: center;
  font-size: ${styles.coinSize / 3}px;
  font-family: montserrat-bold;
  color: black;
`;

const SectionItem = styled.Text`
  width: 100%;
  text-align: center;
  font-size: ${(styles.coinSize * 5) / 12}px;
  font-family: montserrat;
  color: black;
`;

const contentContainerStyle = {
  width: windowWidth,
  padding: smallMarginSize,
};

const BadgeRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const BadgeLink = styled.TouchableOpacity`
  margin-left: ${smallMarginSize}px;
  margin-right: ${smallMarginSize}px;
  justify-content: center;
  align-items: center;
`;

type BadgeIconName = keyof typeof FontAwesome5.glyphMap;

interface BadgeProps {
  url: string;
  icon: BadgeIconName;
  color: string;
  scale?: number;
}

const Badge: FunctionComponent<BadgeProps> = (props) => (
  <BadgeLink onPress={() => Linking.openURL(props.url)}>
    <FontAwesome5
      name={props.icon}
      size={styles.coinSize * (props.scale || 1)}
      color={props.color}
    />
  </BadgeLink>
);

const CreditsFlatList: FunctionComponent = () => (
  <FlatList
    data={credits.body}
    keyExtractor={(_, index) => String(index)}
    ListHeaderComponent={<TitleText>{credits.title}</TitleText>}
    contentContainerStyle={contentContainerStyle}
    renderItem={({ item: section }) => (
      <SectionContainer small={!section.header}>
        {section.header && <SectionHeader>{section.header}</SectionHeader>}
        {section.subheader && (
          <SectionSubheader>{section.subheader}</SectionSubheader>
        )}
        {section.names &&
          section.names.map((name, index) => (
            <SectionItem key={String(index)}>{name}</SectionItem>
          ))}
        <BadgeRow>
          {section.links &&
            section.links.map(({ icon, url, color }, index) => (
              <Badge
                key={String(index)}
                icon={icon as BadgeIconName}
                url={url}
                color={color}
                scale={section.links.length > 3 ? 3 / 4 : 1}
              />
            ))}
        </BadgeRow>
      </SectionContainer>
    )}
  />
);

export default CreditsFlatList;
