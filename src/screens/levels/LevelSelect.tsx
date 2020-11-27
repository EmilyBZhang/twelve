import React, { FunctionComponent, memo, useEffect, useRef, useState } from 'react';
import { Animated, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import styled from 'styled-components/native';

import useSettings from 'hooks/useSettings';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';
import ScreenContainer from 'components/ScreenContainer';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

interface LevelSelectProps {
  numLevels: number;
  onGoToLevel: (index: number) => any;
}
export type LevelSelectType = FunctionComponent<LevelSelectProps>;

const levelBubbleColors = [
  colors.foreground,
  colors.coin,
  colors.selectCoin,
  colors.orderedCoin,
  colors.darkWood,
  colors.badCoin,
];

const TitleText = styled.Text`
  font-size: ${styles.coinSize}px;
  font-family: montserrat-extra-bold;
  text-align: center;
  padding: ${styles.coinSize * 1.5}px 0px;
  color: ${colors.foreground};
  width: 100%;
`;

interface LevelProps {
  unlocked: boolean;
  completed: boolean;
  index: number;
}

interface LevelBoxProps extends LevelProps {
  children: any;
  onGoToLevel: (levelNum: number) => any;
}

const levelBoxSize = levelWidth / 5;
const levelBoxMargin = levelBoxSize / 5;

const LevelBoxContainer = styled(Animated.View)`
  width: ${levelBoxSize}px;
  height: ${levelBoxSize}px;
  justify-content: center;
  align-items: center;
  border-radius: ${levelBoxSize / 2}px;
`;

// TODO: Consider changing to TouchableHighlight with corresponding underlay colors
const LevelBoxTouchable = styled.TouchableOpacity.attrs<LevelProps>(props => ({
  disabled: !props.unlocked,
  activeOpacity: 5/6,
}))<LevelProps>`
  margin-left: ${levelBoxMargin}px;
  margin-bottom: ${levelBoxMargin}px;
  border-radius: ${levelBoxSize / 2}px;
  background-color: ${props => (
    levelBubbleColors[Math.floor(props.index / 12) % levelBubbleColors.length]
  )};
  ${props => !props.unlocked && `opacity: 0.5;`}
`;
  // ${props => props.completed && `border: 2px solid gold;`}

const LevelBoxText = styled.Text`
  color: white;
  text-align: center;
  font-size: ${levelBoxSize / 2}px;
  font-family: montserrat;
  transform: translateY(${-levelBoxSize / 8}px);
`;

const CompletedIcon = styled(MaterialCommunityIcons)
  .attrs<LevelProps>(props => ({
    name: 'star',
    // TODO: Move these to colors.tsx
    color: props.completed ? 'gold' : 'black',
    size: levelBoxSize / 4,
}))<LevelProps>`
  position: absolute;
  bottom: ${levelBoxSize / 8}px;
  opacity: ${props => props.completed ? 1 : props.unlocked ? 0.5 : 0.25};
`;

const LevelBox: FunctionComponent<LevelBoxProps> = memo((props) => {
  const [outlineAnim] = useState(new Animated.Value(0));

  const { onGoToLevel, children, ...levelStatus } = props;

  useEffect(() => {
    if (levelStatus.unlocked && !levelStatus.completed) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(outlineAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(outlineAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
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
      onPress={() => onGoToLevel(levelStatus.index + 1)}
    >
      <LevelBoxContainer style={{
        transform: [{scaleX: scale}, {scaleY: scale}],
      }}>
        <CompletedIcon {...levelStatus} />
        <LevelBoxText>
          {children}
        </LevelBoxText>
      </LevelBoxContainer>
    </LevelBoxTouchable>
  );
});

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
        initialNumToRender={9}
        maxToRenderPerBatch={9}
        ListHeaderComponent={
          <TitleText>Select Level</TitleText>
        }
        renderItem={({ item: levelStatus, index }) => (
          <LevelBox
            {...levelStatus}
            index={index}
            onGoToLevel={props.onGoToLevel}
          >
            {index + 1}
          </LevelBox>
        )}
      />
    </ScreenContainer>
  );
};

export default LevelSelect;
