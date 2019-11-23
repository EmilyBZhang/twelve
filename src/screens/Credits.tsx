// TODO: Make credits screen scroll slowly to the bottom
// IDEA: Make the links at the bottom of the credits each contained inside of a Coin

import React, { FunctionComponent, useCallback, useRef, useState, useEffect } from 'react';
import { FlatList, Linking, Animated, Easing } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import credits from 'assets/credits.json';
import colors from 'assets/colors';
import styles from 'assets/styles';
import strings from 'assets/strings';
import { Screen } from 'utils/interfaces';
import getDimensions from 'utils/getDimensions';
import ScreenContainer from 'components/ScreenContainer';
import LevelNav from 'components/LevelNav';

const { width: windowWidth, height: windowHeight } = getDimensions();

const TitleText = styled.Text`
  width: 100%;
  text-align: center;
  font-size: 36px;
  font-family: montserrat-extra-bold;
  color: ${colors.foreground};
  margin-top: ${styles.levelNavHeight}px;
  margin-bottom: 12px;
`;

const SectionContainer = styled.View`
  width: 100%;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const SectionHeader = styled.Text`
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-family: montserrat-bold;
  color: black;
`;

const SectionItem = styled.Text`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-family: montserrat;
  color: black;
`;

const contentContainerStyle = {
  width: windowWidth,
  padding: 12,
};

const BadgeRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const BadgeLink = styled.TouchableOpacity`
  margin-left: 12px;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

interface BadgeProps {
  url: string;
  iconName: string;
}

const Badge: FunctionComponent<BadgeProps> = (props) => (
  <BadgeLink onPress={() => Linking.openURL(props.url)}>
    <MaterialCommunityIcons
      name={props.iconName}
      size={48}
      color={'black'}
    />
  </BadgeLink>
);

type Section = typeof credits.body[0];

const Credits: Screen = (props) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  // const [scrollAnim] = useState(new Animated.Value(0));
  // const [scrollValue, setScrollValue] = useState(0);
  // const [creditsHeight, setCreditsHeight] = useState(0);
  // const creditsList = useRef<FlatList<Section> | null>(null);

  // scrollAnim.addListener(({ value }) => setScrollValue(value));

  const goToMainMenu = useCallback(() => {
    props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'MainMenu'
    }));
  }, []);

  const handleToggleSettings = useCallback(
    () => setSettingsOpen(state => !state)
  , []);

  const levelNavProps = {
    settingsOpen,
    onBack: goToMainMenu,
    onToggleSettings: handleToggleSettings
  };

  // useEffect(() => {
  //   if (creditsList.current && creditsHeight) {
  //     console.log(creditsHeight - windowHeight);
  //     Animated.timing(scrollAnim, {
  //       toValue: creditsHeight - windowHeight, // TODO: calculate FlatList height - screenHeight
  //       duration: 5000,
  //       easing: Easing.linear
  //     }).start();
  //   }
  // }, [creditsList.current, creditsHeight])

  // if (creditsList.current && scrollValue) {
  //   creditsList.current.scrollToOffset({offset: scrollValue});
  // }

  return (
    <ScreenContainer>
      <LevelNav {...levelNavProps} />
      <FlatList
        // ref={ref => creditsList.current = ref}
        // onLayout={e => setCreditsHeight(e.nativeEvent.layout.height)} Does not work
        data={credits.body}
        keyExtractor={(_, index) => String(index)}
        ListHeaderComponent={(
          <TitleText>{credits.title}</TitleText>
        )}
        contentContainerStyle={contentContainerStyle}
        renderItem={({ item: section }) => (
          <SectionContainer>
            <SectionHeader>{section.header}</SectionHeader>
            {section.names.map((name, index) => (
              <SectionItem key={String(index)}>
                {name}
              </SectionItem>
            ))}
          </SectionContainer>
        )}
        // Maybe convert this to an array in the JSON file?
        ListFooterComponent={(
          <BadgeRow>
            <Badge
              url={strings.urls.github}
              iconName={'github-box'}
            />
            <Badge
              url={strings.urls.soundcloud}
              iconName={'soundcloud'}
            />
          </BadgeRow>
        )}
      />
    </ScreenContainer>
  );
};

export default Credits;
