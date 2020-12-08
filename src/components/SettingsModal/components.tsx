import React, { FunctionComponent, memo, ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { Switch, SwitchProps } from 'react-native';

import getDimensions from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';

const { width: windowWidth, height: windowHeight } = getDimensions();

export const settingsButtonSize = windowWidth / 6;

export const circleIconSize = settingsButtonSize / 2;

export const ResumeIcon = styled(MaterialCommunityIcons).attrs({
  name: 'play',
  size: circleIconSize,
  color: colors.lightText,
})``;

export const ReplayIcon = styled(MaterialCommunityIcons).attrs({
  name: 'replay',
  size: circleIconSize,
  color: colors.lightText,
})``;

export const LevelSelectIcon = styled(MaterialCommunityIcons).attrs({
  name: 'view-grid',
  size: circleIconSize,
  color: colors.lightText,
})``;

export const settingsTextSize = styles.coinSize * 2/3;

export const SettingsText = styled.Text`
  color: white;
  text-align: center;
  font-size: ${settingsTextSize}px;
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

export const switchableIconSize = settingsTextSize;

// TODO: Find a proper way to extend these props from MaterialCommunityIcons
export interface SwitchableSettingIconProps {
  disabled?: boolean;
  size?: number;
  color?: string;
}

export const MusicIcon = styled(MaterialCommunityIcons).attrs<SwitchableSettingIconProps>((props) => ({
  name: props.disabled ? 'music-off' : 'music',
  size: props.size || switchableIconSize,
  color: props.color || colors.lightText,
}))<SwitchableSettingIconProps>``;

export const SfxIcon = styled(MaterialCommunityIcons).attrs<SwitchableSettingIconProps>((props) => ({
  name: props.disabled ? 'volume-off' : 'volume-high',
  size: props.size || switchableIconSize,
  color: props.color || colors.lightText,
}))<SwitchableSettingIconProps>``;

export const ColorblindIcon = styled(MaterialCommunityIcons).attrs<SwitchableSettingIconProps>((props) => ({
  name: props.disabled ? 'circle' : 'plus-circle',
  size: props.size || switchableIconSize,
  color: props.color || colors.lightText,
}))<SwitchableSettingIconProps>``;

type SwitchableSettingIcon = FunctionComponent<SwitchableSettingIconProps>
  | typeof MusicIcon
  | typeof SfxIcon
  | typeof ColorblindIcon;

interface SwitchableSettingProps extends SwitchProps {
  label: string;
  icon?: SwitchableSettingIcon;
}

export const SwitchableSetting: FunctionComponent<SwitchableSettingProps> = memo((props) => {
  const { label, icon: Icon, ...switchProps } = props;
  return (
    <SwitchableSettingContainer>
      {Icon && <Icon disabled={!switchProps.value} />}
      <SwitchableSettingText> {label}</SwitchableSettingText>
      {/* @ts-ignore */}
      <SwitchableSettingSwitch {...switchProps} />
    </SwitchableSettingContainer>
  );
});
