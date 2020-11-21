import React, { FunctionComponent, memo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import useSettings from 'hooks/useSettings';
import colors, { CoinColor, colorIcons, darkCoinColors } from 'res/colors';
import styles from 'res/styles';

type IconColor = 'white' | 'black';

interface ColorHintProps {
  color?: CoinColor;
  iconColor?: IconColor;
  size?: number;
  opacity?: number;
}

const ColorHint: FunctionComponent<ColorHintProps> = (props) => {
  const [settings] = useSettings();

  if (!settings.colorblind) return null;

  const {
    color = colors.coin,
    iconColor = darkCoinColors.has(color) ? 'white' : 'black',
    size = styles.coinSize / 2,
    opacity
  } = props;
  const iconName = colorIcons[color];

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
