import React, { FunctionComponent, memo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import useSettings from 'hooks/useSettings';
import colors, { CoinColor, colorIcons } from 'assets/colors';
import styles from 'assets/styles';

type IconColor = 'white' | 'black';

interface ColorHintProps {
  backgroundColor?: CoinColor;
  iconColor?: IconColor;
  size?: number;
  opacity?: number;
}

const ColorHint: FunctionComponent<ColorHintProps> = (props) => {
  const [settings] = useSettings();

  if (!settings.colorblind) return null;

  const darkColor = props.backgroundColor === colors.coin || props.backgroundColor === colors.selectCoin;
  const {
    backgroundColor = colors.coin,
    iconColor = darkColor ? 'white' : 'black',
    size = styles.coinSize / 2,
    opacity
  } = props;
  const iconName = colorIcons[backgroundColor];

  return (
    <MaterialCommunityIcons
      name={iconName}
      color={iconColor}
      size={size}
      style={{position: 'absolute', opacity}}
    />
  );
};

export default memo(ColorHint);
