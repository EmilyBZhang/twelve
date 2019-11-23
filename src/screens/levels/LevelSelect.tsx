import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Animated, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import styled from 'styled-components/native';

import useSettings from 'hooks/useSettings';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'assets/colors';
import ScreenContainer from 'components/ScreenContainer';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

interface LevelSelectProps {
  numLevels: number;
  onGoToLevel: (index: number) => any;
}
export type LevelSelectType = FunctionComponent<LevelSelectProps>;

const TitleText = styled.Text`
  font-size: 36px;
  font-family: montserrat-extra-bold;
  text-align: center;
  padding-top: 64px;
  padding-bottom: 64px;
  color: ${colors.foreground};
  width: 100%;
`;

interface LevelBoxProps {
  unlocked: boolean;
  completed: boolean;
  children?: any;
  onPress?: () => any;
}

const levelBoxSize = levelWidth / 5;
const levelBoxMargin = levelBoxSize / 5;

const LevelBoxContainer = styled(Animated.View)`
  width: ${levelBoxSize}px;
  height: ${levelBoxSize}px;
  justify-content: center;
  align-items: center;
  border-radius: ${levelBoxSize / 2}px;
  background-color: ${colors.foreground};
`;

const LevelBoxTouchable = styled.TouchableHighlight.attrs<LevelBoxProps>(props => ({
  disabled: !props.unlocked,
  underlayColor: colors.foregroundPressed
}))<LevelBoxProps>`
  margin-left: ${levelBoxMargin}px;
  margin-bottom: ${levelBoxMargin}px;
  border-radius: ${levelBoxSize / 2}px;
  ${props => !props.unlocked && `opacity: 0.5;`}
`;
  // ${props => props.completed && `border: 2px solid gold;`}

const LevelBoxText = styled.Text<LevelBoxProps>`
  color: white;
  text-align: center;
  font-size: ${levelBoxSize / 2}px;
  font-family: montserrat;
  transform: translateY(${-levelBoxSize / 8}px);
`;

const CompletedIcon = styled(MaterialCommunityIcons)
  .attrs<LevelBoxProps>(props => ({
    name: 'star',
    color: props.completed ? 'gold' : colors.foregroundPressed,
    size: levelBoxSize / 4,
}))<LevelBoxProps>`
  position: absolute;
  bottom: ${levelBoxSize / 8}px;
  opacity: ${props => props.unlocked ? 1 : 0.5};
`;

const LevelBox: FunctionComponent<LevelBoxProps> = (props) => {
  const [outlineAnim] = useState(new Animated.Value(0));

  const { onPress, children, ...levelStatus } = props;

  useEffect(() => {
    if (levelStatus.unlocked && !levelStatus.completed) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(outlineAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(outlineAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
          }),
        ])
      );
      anim.start();
      return anim.stop;
    }
  }, [levelStatus.unlocked, levelStatus.completed]);

  const scale = outlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 13 / 12]
  });

  const opacity = outlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3 / 4]
  });

  return (
    <LevelBoxTouchable
      {...levelStatus}
      onPress={onPress}
    >
      <LevelBoxContainer style={{
        // opacity,
        transform: [{scaleX: scale}, {scaleY: scale}],
      }}>
        <CompletedIcon {...levelStatus} />
        <LevelBoxText {...levelStatus}>
          {children}
        </LevelBoxText>
      </LevelBoxContainer>
    </LevelBoxTouchable>
  );
};

const levelListStyle = {
  width: levelWidth
};

const LevelSelect: LevelSelectType = (props) => {
  const [{ levelStatus: levelStatuses }] = useSettings();

  return (
    <ScreenContainer>
      <FlatList
        data={levelStatuses}
        numColumns={4}
        horizontal={false}
        keyExtractor={(_, index) => String(index)}
        contentContainerStyle={levelListStyle}
        ListHeaderComponent={
          <TitleText>Select Level</TitleText>
        }
        renderItem={({ item: levelStatus, index }) => (
          <LevelBox
            {...levelStatus}
            onPress={() => props.onGoToLevel(index + 1)}
          >
            {index + 1}
          </LevelBox>
        )}
      />
    </ScreenContainer>
  );
};

export default LevelSelect;
