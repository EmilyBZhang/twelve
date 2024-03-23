import React, { FunctionComponent, memo, ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { Octicons } from '@expo/vector-icons';
import { Switch, SwitchProps, TouchableOpacityProps } from 'react-native';

import getDimensions from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';
import { MaterialCommunityIconsProps } from 'utils/types';

const { width: windowWidth, height: windowHeight } = getDimensions();

export const settingsButtonSize = windowWidth / 6;

export const circleIconSize = settingsButtonSize / 2;

export const ResumeIcon = styled(MaterialCommunityIcons).attrs({
  name: 'play',
  size: circleIconSize,
  color: colors.lightText,
})<Partial<MaterialCommunityIconsProps>>``;

export const ReplayIcon = styled(MaterialCommunityIcons).attrs({
  name: 'replay',
  size: circleIconSize,
  color: colors.lightText,
})<Partial<MaterialCommunityIconsProps>>``;

export const LevelSelectIcon = styled(MaterialCommunityIcons).attrs({
  name: 'view-grid',
  size: circleIconSize,
  color: colors.lightText,
})<Partial<MaterialCommunityIconsProps>>``;

export const settingsTextSize = (styles.coinSize * 2) / 3;

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
  name?: string;
  disabled?: boolean;
  size?: number;
  color?: string;
}

export const MusicIcon = styled(
  MaterialCommunityIcons
).attrs<SwitchableSettingIconProps>((props) => ({
  name: props.disabled ? 'music-off' : 'music',
  size: props.size || switchableIconSize,
  color: props.color || colors.lightText,
}))<SwitchableSettingIconProps>``;

export const SfxIcon = styled(
  MaterialCommunityIcons
).attrs<SwitchableSettingIconProps>((props) => ({
  name: props.disabled ? 'volume-off' : 'volume-high',
  size: props.size || switchableIconSize,
  color: props.color || colors.lightText,
}))<SwitchableSettingIconProps>``;

export const ColorblindIcon = styled(
  MaterialCommunityIcons
).attrs<SwitchableSettingIconProps>((props) => ({
  name: props.disabled ? 'circle' : 'plus-circle',
  size: props.size || switchableIconSize,
  color: props.color || colors.lightText,
}))<SwitchableSettingIconProps>``;

type SwitchableSettingIcon =
  | FunctionComponent<SwitchableSettingIconProps>
  | typeof MusicIcon
  | typeof SfxIcon
  | typeof ColorblindIcon;

interface SwitchableSettingProps extends SwitchProps {
  label: string;
  icon?: SwitchableSettingIcon;
}

export const SwitchableSetting: FunctionComponent<SwitchableSettingProps> =
  memo((props) => {
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

export const LevelNavContainer = styled.View.attrs({
  pointerEvents: 'box-none',
})`
  width: 100%;
  min-height: ${styles.levelNavHeight}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const LevelNavText = styled.Text`
  color: ${colors.lightText};
  font-family: montserrat-bold;
  font-size: ${(styles.levelNavHeight * 2) / 3}px;
  text-align: center;
  padding: ${styles.levelNavHeight / 6}px;
  width: ${(styles.levelNavHeight * 4) / 3}px;
`;

export interface LevelNavButtonProps {
  disabled?: boolean;
  onPress?: () => any;
}

export const LevelNavButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})<LevelNavButtonProps>`
  margin: ${styles.levelNavHeight / 12}px;
  padding: ${styles.levelNavHeight / 12}px;
  height: ${(styles.levelNavHeight * 5) / 6}px;
  width: ${(styles.levelNavHeight * 5) / 6}px;
  justify-content: center;
  align-items: center;
  border-radius: ${styles.levelNavHeight}px;
  opacity: ${(props) => (props.disabled ? 1 / 12 : 1)};
`;

export const LevelNavLeft: FunctionComponent<LevelNavButtonProps> = (props) => (
  <LevelNavButton {...props}>
    <Octicons
      name={'chevron-left'}
      size={(styles.levelNavHeight * 7) / 12}
      color={colors.lightText}
    />
  </LevelNavButton>
);

export const LevelNavRight: FunctionComponent<LevelNavButtonProps> = (
  props
) => (
  <LevelNavButton {...props}>
    <Octicons
      name={'chevron-right'}
      size={(styles.levelNavHeight * 7) / 12}
      color={colors.lightText}
    />
  </LevelNavButton>
);
