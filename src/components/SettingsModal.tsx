import React, { FunctionComponent } from 'react';
import { Text, Modal, View, TouchableOpacity, Button } from 'react-native';
import styled from 'styled-components/native';

import useSettings from 'hooks/useSettings';
import { clearSettings } from 'utils/settings';
import getDimensions from 'utils/getDimensions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import MuteMusicIcon from 'components/icons/MuteMusicIcon';
import MuteSfxIcon from 'components/icons/MuteSfxIcon';
import ColorblindIcon from 'components/icons/ColorblindIcon';

const { width: windowWidth, height: windowHeight } = getDimensions();

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
  width: ${windowWidth}px;
  height: ${windowHeight}px;
  margin: 0px;
  z-index: ${styles.levelNavZIndex + 1};
  justify-content: center;
  align-items: center;
`;

const SettingsButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;
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
  const [
    { musicMuted, sfxMuted, colorblind },
    { toggleMusic, toggleSfx, toggleColorblind }
  ] = useSettings();

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
        <SettingsButtonsContainer>
          <SettingsButton onPress={toggleMusic}>
            <MuteMusicIcon muted={musicMuted} />
          </SettingsButton>
          <SettingsButton onPress={toggleSfx}>
            <MuteSfxIcon muted={sfxMuted} />
          </SettingsButton>
          <SettingsButton onPress={toggleColorblind}>
            <ColorblindIcon colorblind={colorblind} />
          </SettingsButton>
        </SettingsButtonsContainer>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 24}}>
          {'\n'}Press anywhere to close{'\n'}
        </Text>
        {props.onNextLevel && (<>
          <Button title={'Skip level'} onPress={props.onNextLevel} />
          <Text>{'\n'}</Text>
        </>)}
        <Button title={'Clear settings'} onPress={clearSettings} />
      </TouchableOpacity>
    </FullScreenModal>
  );
};

export default SettingsModal;
