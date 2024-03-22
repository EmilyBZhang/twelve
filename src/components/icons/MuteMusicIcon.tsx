import React, { FunctionComponent } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MuteMusicIconProps {
  muted?: boolean;
  size?: number;
  color?: string;
}

const MuteMusicIcon: FunctionComponent<MuteMusicIconProps> = (props) => {
  const {
    size = 24,
    color = 'white',
    muted
  } = props;
  return (
    <MaterialCommunityIcons
      name={muted ? 'music-off' : 'music'}
      size={size}
      color={color}
    />
  );
}

export default MuteMusicIcon;
