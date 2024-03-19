import React, { FunctionComponent, memo, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components/native';

import hints from 'assets/info/hints.json';
import colors from 'res/colors';
import styles from 'res/styles';
import useRewardedAd, { EventMap } from 'hooks/useRewardedAd';
import useSettings from 'hooks/useSettings';
import {
  LargeVictoryButton,
  LargeVictoryButtonText,
  SmallVictoryButton,
  SmallVictoryButtonText,
} from './VictoryButton';
import { NUM_LEVELS } from 'res/constants';

interface HintModalProps {
  level: number;
  visible?: boolean;
  onClose: () => any;
  noAutoStart?: boolean;
  showHint?: boolean;
  onNextLevel?: () => any;
}

const waitingText = 'Your hint will come after this ad...';
const skippingText = 'Level will be skipped after this ad...';
const nudgeText = `Twelve only shows ads for hints and skipping levels.\n\nWe're working on a No Ads bundle so you can choose to play without ads!`
// const nudgeText = `Psst... don't like ads? Please consider buying the No Ads bundle to remove all ads and support the developers. It really would mean a lot to us. ♥`
const noHintText = 'No hint available';

const FullScreenModal = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: ${colors.background}e0;
  width: 100%;
  height: 100%;
  margin: 0px;
  z-index: ${styles.levelNavZIndex + 1};
  justify-content: flex-start;
  align-items: center;
  padding: ${100/24}% ${100/12}%;
`;

const ButtonsContainer = styled.View`
  width: 100%;
`;

const HintTitle = styled.Text`
  font-family: montserrat-bold;
  font-size: ${styles.coinSize}px;
  color: ${colors.foreground};
  text-align: center;
  width: 100%;
  margin-top: ${styles.coinSize / 2}px;
`;

const HintTextContainer = styled.View`
  width: 100%;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HintText = styled.Text`
  font-family: montserrat;
  font-size: ${styles.coinSize * 2 / 3}px;
  color: ${colors.darkText};
  text-align: center;
`;

const NudgeText = styled.Text`
  font-family: montserrat;
  font-size: ${styles.coinSize / 3}px;
  color: ${colors.darkText};
  text-align: center;
  width: 100%;
`;

// TODO: IDEA: Light modal on black background
const HintModal: FunctionComponent<HintModalProps> = memo((props) => {
  const { level, visible, onClose, noAutoStart, showHint, onNextLevel } = props;
  const [hint, setHint] = useState(waitingText);

  const { unlockLevel } = useSettings([])[1];

  const adRewarded = useRef(false);
  const closable = useRef(false);
  const skipping = useRef(false);
  const skipped = useRef(false);
  const hintNum = useRef(0);
  const levelHints = hints[level - 1];

  const handleClose = useCallback(() => {
    closable.current = false;
    skipping.current = false;
    skipped.current = false;
    if (adRewarded.current) {
      hintNum.current++;
      hintNum.current %= levelHints.length;
    }
    adRewarded.current = false;
    onClose();
    setHint(waitingText);
  }, [onClose]);

  const handleSkip = useCallback(() => {
    closable.current = false;
    skipping.current = true;
    skipped.current = false;
    setHint(skippingText);
    requestAd();
  }, [level]);

  const callbacks = useMemo<EventMap>(() => ({
    rewardedVideoDidDismiss: () => {
      if (!adRewarded.current) onClose();
      else if (skipping.current) {
        closable.current = false;
        skipping.current = false;
        adRewarded.current = false;
        if (!skipped.current) {
          hintNum.current++;
          hintNum.current %= levelHints.length;
        }
        skipped.current = false;
        setHint(waitingText);
        onClose();
      }
    },
    rewardedVideoUserDidEarnReward: () => {
      closable.current = true;
      if (adRewarded.current) {
        // Watch ad to skip
        unlockLevel(level + 1);
        if (onNextLevel) {
          onNextLevel();
          skipped.current = true;
        }
      } else {
        // Watch ad for hint
        adRewarded.current = true;
        setHint(levelHints ? levelHints[hintNum.current] : noHintText);
      }
    },
    // TODO: Check for specific errors
    rewardedVideoDidFailToLoad: (err) => {
      closable.current = true;
      // setHint(`Couldn't load hint :(\n\nCheck your internet connection.`);
      // Let hints run if video fails to load - while it's worse for ad revenue it's better for UX
      if (adRewarded.current) {
        // Watch ad to skip
        unlockLevel(level + 1);
        if (onNextLevel) {
          onNextLevel();
          skipped.current = true;
        }
      } else {
        // Watch ad for hint
        adRewarded.current = true;
        setHint(levelHints ? levelHints[hintNum.current] : noHintText);
      }
    },
  }), [level]);

  const requestAd = useRewardedAd(callbacks);

  useEffect(() => {
    setHint(waitingText);
    hintNum.current = 0;
  }, [level]);

  useEffect(() => {
    if (!visible || noAutoStart) return;
    requestAd();
  }, [visible, noAutoStart]);

  useEffect(() => {
    if (!showHint) return;
    adRewarded.current = true;
    closable.current = true;
    skipped.current = false;
    setHint(levelHints ? levelHints[hintNum.current] : noHintText);
  }, [showHint]);

  if (!visible) return null;

  return (
    <FullScreenModal>
      <HintTitle>Hint {hintNum.current + 1}/{levelHints.length}</HintTitle>
      <HintTextContainer>
        <HintText>{hint}</HintText>
      </HintTextContainer>
      <ButtonsContainer>
        <LargeVictoryButton
          onPress={handleClose}
          disabled={!closable.current}
        >
          <LargeVictoryButtonText>Return to game</LargeVictoryButtonText>
        </LargeVictoryButton>
        <SmallVictoryButton
          onPress={handleSkip}
          disabled={!closable.current || level === NUM_LEVELS}
        >
          <SmallVictoryButtonText>Watch ad to skip level</SmallVictoryButtonText>
        </SmallVictoryButton>
      </ButtonsContainer>
      <NudgeText>{nudgeText}</NudgeText>
    </FullScreenModal>
  );
});

export default HintModal;
