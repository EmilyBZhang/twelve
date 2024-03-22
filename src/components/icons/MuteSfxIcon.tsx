import React, { FunctionComponent } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MuteSfxIconProps {
  muted?: boolean;
  size?: number;
  color?: string;
}

const MuteSfxIcon: FunctionComponent<MuteSfxIconProps> = (props) => {
  const {
    size = 24,
    color = 'white',
    muted
  } = props;
  return (
    <MaterialCommunityIcons
      name={muted ? 'volume-off' : 'volume-high'}
      size={size}
      color={color}
    />
  );
}

export default MuteSfxIcon;
