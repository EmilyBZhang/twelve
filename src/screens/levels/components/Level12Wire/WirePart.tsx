import React, { FunctionComponent, memo, useState } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';

import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'assets/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export enum WireType {
  line,
  segment,
  corner
}

interface WirePartProps {
  type: WireType;
  initOrientation: number;
  onOrientationChange: () => any;
  disabled?: boolean;
  children?: any;
}

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

export const wirePartSize = levelWidth / 4;
const wireColor = colors.coin;

const WirePartContainer = styled(Animated.View)`
  width: ${wirePartSize}px;
  height: ${wirePartSize}px;
  justify-content: center;
  align-items: center;
`;

interface WirePartHalfProps {
  direction?: 'top' | 'bottom' | 'left';
}

const WirePartHalf = styled.View<WirePartHalfProps>`
  position: absolute;
  width: 2px;
  height: ${wirePartSize / 2}px;
  background-color: ${wireColor};
  transform: ${props => {
    switch (props.direction) {
      case 'bottom': return `translateY(${wirePartSize / 4}px)`;
      case 'left': return `rotate(-90deg) translateX(${-wirePartSize / 4}px)`;
      default: return `translateY(${-wirePartSize / 4}px)`;
    }
  }};
`;

const WireJoint = styled.View`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: ${wireColor};
  border-radius: 4px;
`;

const WireTypeComponents = {
  [WireType.line]: (<>
    <WirePartHalf />
    <WirePartHalf direction={'bottom'} />
  </>),
  [WireType.segment]: (<>
    <WirePartHalf />
    <WireJoint />
  </>),
  [WireType.corner]: (<>
    <WirePartHalf />
    <WirePartHalf direction={'left'} />
    <WireJoint />
  </>),
}

const WirePart: FunctionComponent<WirePartProps> = (props) => {
  const [orientation, setOrientation] = useState(props.initOrientation);
  const [rotateAnim] = useState(new Animated.Value(props.initOrientation));

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 4],
    outputRange: ['0deg', '360deg']
  });

  const handlePress = () => {
    Animated.timing(rotateAnim, {
      toValue: orientation + 1,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    setOrientation(state => state + 1);
    props.onOrientationChange();
  };

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      disabled={props.disabled}
    >
      <WirePartContainer style={{
        transform: [{rotate}]
      }}>
        {WireTypeComponents[props.type]}
        {props.children}
      </WirePartContainer>
    </TouchableWithoutFeedback>
  );
};

export default memo(WirePart);
