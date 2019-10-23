import React, { FunctionComponent } from 'react';
import { Octicons } from '@expo/vector-icons';

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
    <Octicons
      name={muted ? 'mute' : 'unmute'}
      size={size}
      color={color}
    />
  );
}

export default MuteSfxIcon;
