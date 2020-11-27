import React, { FunctionComponent, memo, ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import getDimensions from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';

const { width: windowWidth, height: windowHeight } = getDimensions();

export const settingsButtonSize = windowWidth / 6;

export const SettingsText = styled.Text`
  color: white;
  text-align: center;
  font-size: ${styles.coinSize * 2/3}px;
  font-family: montserrat;
  text-align: left;
`;

const SwitchableSettingText = styled.Text`
  color: white;
  text-align: center;
  font-size: ${styles.coinSize / 2}px;
  font-family: montserrat;
  flex: 1;
  text-align: left;
`;

const SwitchableSettingContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: ${styles.coinSize / 3}px ${styles.coinSize}px;
`;

const SwitchableSettingSwitch = styled.Switch.attrs({
  thumbColor: colors.plainSurface,
  trackColor: {
    true: colors.coin,
    false: colors.badCoin,
  },
})`
  transform: scale(1.5, 1.5);
`;

interface SwitchableSettingProps extends ComponentProps<typeof SwitchableSettingSwitch> {
  label: string;
}

export const SwitchableSetting: FunctionComponent<SwitchableSettingProps> = memo((props) => {
  const { label, ...switchProps } = props;
  return (
    <SwitchableSettingContainer>
      <SwitchableSettingText>{label}</SwitchableSettingText>
      <SwitchableSettingSwitch {...switchProps} />
    </SwitchableSettingContainer>
  );
});

export const ResumeIcon = styled(MaterialCommunityIcons).attrs({
  name: 'play',
  size: settingsButtonSize / 2,
  color: colors.lightText,
})``;

export const ReplayIcon = styled(MaterialCommunityIcons).attrs({
  name: 'replay',
  size: settingsButtonSize / 2,
  color: colors.lightText,
})``;

export const LevelSelectIcon = styled(MaterialCommunityIcons).attrs({
  name: 'view-grid',
  size: settingsButtonSize / 2,
  color: colors.lightText,
})``;
