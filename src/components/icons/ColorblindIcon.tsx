import React, { FunctionComponent } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ColorblindIconProps {
  colorblind?: boolean;
  size?: number;
  color?: string;
}

const ColorblindIcon: FunctionComponent<ColorblindIconProps> = (props) => {
  const {
    size = 24,
    color = 'white',
    colorblind
  } = props;
  return (
    <MaterialCommunityIcons
      name={colorblind ? 'plus-circle' : 'circle'}
      size={size}
      color={color}
    />
  );
}

export default ColorblindIcon;
