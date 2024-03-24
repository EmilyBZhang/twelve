import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import styles from 'res/styles';
import colors from 'res/colors';
import LevelContainer from 'components/LevelContainer';
import LevelCounter from 'components/LevelCounter';
import HintModal from 'components/HintModal';
import { HintIcon } from 'components/LevelNav/components';

const HintButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.5,
})`
  position: absolute;
  top: 0px;
  right: 0px;
  width: ${styles.levelNavHeight}px;
  height: ${styles.levelNavHeight}px;
  justify-content: center;
  align-items: center;
  z-index: ${styles.levelNavZIndex};
  background-color: ${colors.background};
`;

const LevelAd: Level = (props) => {
  const [hintVisible, setHintVisible] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const propsRef = useRef(props);
  propsRef.current = props;

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound >= 12;

  const handleCloseHint = useCallback(() => {
    setHintVisible(false);
    setShowHint(false);
  }, []);

  const handleShowHint = useCallback(() => {
    setHintVisible(true);
    setTimeout(() => {
      props.navigation.navigate('FakeAd', { propsRef });
      setTimeout(() => {
        setShowHint(true);
      }, 1000 / 12);
    }, 2000);
  }, []);

  return (
    <>
      <HintModal
        noAutoStart
        level={props.levelNum}
        visible={hintVisible}
        onClose={handleCloseHint}
        showHint={showHint}
      />
      <HintButton onPress={handleShowHint}>
        <HintIcon />
      </HintButton>
      <LevelContainer>
        <LevelCounter count={numCoinsFound} />
      </LevelContainer>
    </>
  );
};

export default LevelAd;
