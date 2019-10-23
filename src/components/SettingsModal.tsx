import React, { FunctionComponent } from 'react';
import { Text, Modal, View, TouchableOpacity, Button } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';

import { toggleMusic, toggleSfx, RootState } from 'reducers/settings/actions';
import { resetSettings } from 'utils/settings';
import getDimensions from 'utils/getDimensions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import MuteMusicIcon from 'components/icons/MuteMusicIcon';
import MuteSfxIcon from 'components/icons/MuteSfxIcon';

const { width: screenWidth, height: screenHeight } = getDimensions();

interface SettingsModalProps {
  onClose: () => any;
  visible?: boolean;
  onNextLevel?: () => any;
}

const FullScreenModal = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  backgroundColor: #00000080;
  width: ${screenWidth}px;
  height: ${screenHeight}px;
  margin: 0px;
  z-index: ${styles.levelNavZIndex + 1};
  justify-content: center;
  align-items: center;
`;

const SettingsButton = styled.TouchableHighlight.attrs({
  underlayColor: colors.foregroundPressed
})`
  background-color: ${colors.foreground};
  margin: 8px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const SettingsModal: FunctionComponent<SettingsModalProps> = (props) => {
  const musicMuted = useSelector((state: RootState) => state.settings.musicMuted);
  const sfxMuted = useSelector((state: RootState) => state.settings.sfxMuted);
  const dispatch = useDispatch();

  if (!props.visible) return null;
  return (
    <FullScreenModal>
      <TouchableOpacity
        onPress={() => props.onClose()}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <SettingsButton onPress={() => dispatch(toggleMusic())}>
          <MuteMusicIcon muted={musicMuted} />
        </SettingsButton>
        <SettingsButton onPress={() => dispatch(toggleSfx())}>
          <MuteSfxIcon muted={sfxMuted} />
        </SettingsButton>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 24}}>
          {'\n'}Press anywhere to close{'\n'}
        </Text>
        {props.onNextLevel && (<>
          <Button title={'Skip level'} onPress={props.onNextLevel} />
          <Text>{'\n'}</Text>
        </>)}
        <Button title={'Reset settings'} onPress={() => resetSettings()} />
      </TouchableOpacity>
    </FullScreenModal>
  );
};

export default SettingsModal;
