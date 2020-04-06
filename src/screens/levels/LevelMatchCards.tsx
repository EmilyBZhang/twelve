import React, { useState, useEffect } from 'react';
import { Animated, Easing, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { calcPositions } from 'utils/coinPositions';
import { getLevelDimensions } from 'utils/getDimensions';
import useSelectedIndices from 'hooks/useSelectedIndices';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import { shuffleArray } from 'utils/random';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const cardWidth = styles.coinSize * 2;
const cardHeight = cardWidth / 0.7;

const xGap = (levelWidth - cardWidth * 4) / 5;
const yGap = (levelHeight - cardHeight * 3) / 4;

const symbols = [
  'egg',
  'dice-d12',
  'clock',
  'zodiac-pisces',
  'calendar',
  'brain',
];
const cardLabelsInit = [...symbols, ...symbols];

const coinPositions = Array.from(Array(12), (_, index) => {
  const r = Math.floor(index / 4);
  const c = index % 4;
  return ({
    top: yGap + r * (cardHeight + yGap),
    left: xGap + c * (cardWidth + xGap)
  });
});

const Card = styled(Animated.View)`
  /* background-color: ${colors.selectCoin}; */
  justify-content: center;
  align-items: center;
`;

const CardLabel = styled(MaterialCommunityIcons).attrs({
  size: styles.coinSize,
  // color: 'white',
})``;

const CardTouchable = styled.TouchableHighlight.attrs({
  underlayColor: colors.selectCoinUnderlay
})`
  background-color: ${colors.selectCoin};
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  border-radius: ${cardWidth / 12}px;
  justify-content: center;
  align-items: center;
`;

const LevelMatchCards: Level = (props) => {

  const [cardLabels] = useState(() => {
    const cardLabels = cardLabelsInit.slice();
    shuffleArray(cardLabels);
    return cardLabels;
  });
  const [cardScales] = useState(() => cardLabels.map(() => new Animated.Value(1)));
  const [disabledCards, toggleDisabledCard] = useSelectedIndices();
  const [revealedCards, toggleRevealedCard] = useSelectedIndices();
  const [revealedCard1, setRevealedCard1] = useState(-1);
  const [revealedCard2, setRevealedCard2] = useState(-1);

  // TODO: Maybe add wobble effect to selected card
  // useEffect(() => {
  //   if (revealedCard2 === -1) return;

  // }, [revealedCard2]);

  const revealCard = (cardIndex: number, callback?: () => any, duration = 500) => {
    toggleDisabledCard(cardIndex);
    Animated.timing(cardScales[cardIndex], {
      toValue: 1 / 144,
      duration: duration / 2,
      easing: Easing.quad,
      useNativeDriver: true
    }).start(() => {
      toggleRevealedCard(cardIndex);
      Animated.timing(cardScales[cardIndex], {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }).start(callback);
    });
  };

  const hideCard = (cardIndex: number, callback?: () => any) => {
    revealCard(cardIndex, callback, 250);
  };

  const handleCardPress = (cardIndex: number) => {
    if (revealedCard1 === -1) {
      setRevealedCard1(cardIndex);
      revealCard(cardIndex);
    } else if (revealedCard2 === -1) {
      setRevealedCard2(cardIndex);
      revealCard(cardIndex, () => {
        if (cardLabels[revealedCard1] === cardLabels[cardIndex]) {
          // TODO: Add glowing animation, something satisfying for getting it right
          setRevealedCard1(-1);
          setRevealedCard2(-1);
        } else {
          setTimeout(() => {
            hideCard(revealedCard1, () => setRevealedCard1(-1));
            hideCard(cardIndex, () => setRevealedCard2(-1));
          }, 250);
        }
      });
    }
  };

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      {coinPositions.map((coinPosition, index) => (
        <Card
          key={String(index)}
          style={{
            ...coinPosition,
            position: 'absolute',
            transform: [{scaleX: cardScales[index]}]
          }}
        >
          <CardTouchable
            onPress={() => handleCardPress(index)}
            disabled={disabledCards.has(index)}
          >
            {/* TODO: Fix CardLabel to hide when it is not revealed */}
            <CardLabel
              name={cardLabels[index]}
              color={revealedCards.has(index) ? 'white' : 'transparent'}
            />
          </CardTouchable>
          <View style={{position: 'absolute'}}>
            <Coin
              found={
                props.coinsFound.has(index)
                || !revealedCards.has(index)
                || index === revealedCard1
                || index === revealedCard2
              }
              onPress={() => props.onCoinPress(index)}
            />
          </View>
        </Card>
      ))}
    </LevelContainer>
  );
};

export default LevelMatchCards;

// import React, { useState, useEffect } from 'react';
// import { Animated, Easing, View } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import styled from 'styled-components/native';

// import { Level } from 'utils/interfaces';
// import { calcPositions } from 'utils/coinPositions';
// import { getLevelDimensions } from 'utils/getDimensions';
// import useSelectedIndices from 'hooks/useSelectedIndices';
// import colors from 'assets/colors';
// import styles from 'assets/styles';
// import LevelContainer from 'components/LevelContainer';
// import Coin from 'components/Coin';
// import LevelText from 'components/LevelText';
// import LevelCounter from 'components/LevelCounter';
// import { shuffleArray } from 'utils/random';

// const { width: levelWidth, height: levelHeight } = getLevelDimensions();

// const cardWidth = styles.coinSize * 2;
// const cardHeight = cardWidth / 0.7;

// const xGap = (levelWidth - cardWidth * 4) / 5;
// const yGap = (levelHeight - cardHeight * 3) / 4;

// const symbols = [
//   'egg',
//   'dice-d12',
//   'clock',
//   'zodiac-pisces',
//   'calendar',
//   'brain',
// ];
// const cardLabelsInit = [...symbols, ...symbols];

// const coinPositions = Array.from(Array(12), (_, index) => {
//   const r = Math.floor(index / 4);
//   const c = index % 4;
//   return ({
//     top: yGap + r * (cardHeight + yGap),
//     left: xGap + c * (cardWidth + xGap)
//   });
// });

// const Card = styled(Animated.View)`
//   /* background-color: ${colors.selectCoin}; */
//   justify-content: center;
//   align-items: center;
// `;

// const CardLabel = styled(MaterialCommunityIcons).attrs({
//   size: styles.coinSize,
//   color: 'white',
// })``;

// const CardTouchable = styled.TouchableHighlight.attrs({
//   underlayColor: colors.selectCoinUnderlay
// })`
//   background-color: ${colors.selectCoin};
//   width: ${cardWidth}px;
//   height: ${cardHeight}px;
//   border: 2px solid black;
//   border-radius: ${cardWidth / 12}px;
//   justify-content: center;
//   align-items: center;
// `;

// const LabelContainer = styled(Animated.View).attrs({
//   pointerEvents: 'box-none'
// })`
//   justify-content: center;
//   align-items: center;
// `;

// const LevelMatchCards: Level = (props) => {

//   const [cardLabels] = useState(() => {
//     const cardLabels = cardLabelsInit.slice();
//     shuffleArray(cardLabels);
//     return cardLabels;
//   });
//   const [cardScales] = useState(() => cardLabels.map(() => new Animated.Value(-1)));
//   const [disabledCards, toggleDisabledCard] = useSelectedIndices();
//   const [revealedCard1, setRevealedCard1] = useState(-1);
//   const [revealedCard2, setRevealedCard2] = useState(-1);

//   // TODO: Maybe add wobble effect to selected card
//   // useEffect(() => {
//   //   if (revealedCard2 === -1) return;

//   // }, [revealedCard2]);

//   const revealCard = (cardIndex: number, callback?: () => any, toValue = 1, duration = 500) => {
//     toggleDisabledCard(cardIndex);
//     Animated.timing(cardScales[cardIndex], {
//       toValue,
//       duration,
//       easing: Easing.inOut(Easing.quad),
//       useNativeDriver: true
//     }).start(callback);
//   };

//   const hideCard = (cardIndex: number, callback?: () => any) => {
//     revealCard(cardIndex, callback, -1, 250);
//   };

//   const handleCardPress = (cardIndex: number) => {
//     if (revealedCard1 === -1) {
//       setRevealedCard1(cardIndex);
//       revealCard(cardIndex);
//     } else if (revealedCard2 === -1) {
//       setRevealedCard2(cardIndex);
//       revealCard(cardIndex, () => {
//         if (cardLabels[revealedCard1] === cardLabels[cardIndex]) {
//           // TODO: Add glowing animation, something satisfying for getting it right
//           setRevealedCard1(-1);
//           setRevealedCard2(-1);
//         } else {
//           setTimeout(() => {
//             hideCard(revealedCard1, () => setRevealedCard1(-1));
//             hideCard(cardIndex, () => setRevealedCard2(-1));
//           }, 250);
//         }
//       });
//     }
//   };

//   const numCoinsFound = props.coinsFound.size;
//   const twelve = numCoinsFound === 12;

//   return (
//     <LevelContainer>
//       <LevelCounter count={numCoinsFound} />
//       {coinPositions.map((coinPosition, index) => (
//         <Card
//           key={String(index)}
//           style={{
//             ...coinPosition,
//             position: 'absolute',
//             transform: [{scaleX: cardScales[index]}]
//           }}
//         >
//           <CardTouchable
//             onPress={() => handleCardPress(index)}
//             disabled={disabledCards.has(index)}
//           >
//             <LabelContainer
//               style={{
//                 opacity: cardScales[index].interpolate({
//                   inputRange: [-1, 0, 0, 1],
//                   outputRange: [0, 0, 0, 0]
//                 })
//               }}
//             >
//               {/* TODO: Fix CardLabel to hide when it is not revealed */}
//               {/* <CardLabel
//                 name={cardLabels[index]}
//               />
//               <View style={{position: 'absolute'}}>
//                 <Coin
//                   found={
//                     props.coinsFound.has(index)
//                     || !disabledCards.has(index)
//                     || index === revealedCard1
//                     || index === revealedCard2
//                   }
//                   onPress={() => props.onCoinPress(index)}
//                 />
//               </View> */}
//             </LabelContainer>
//           </CardTouchable>
//         </Card>
//       ))}
//     </LevelContainer>
//   );
// };

// export default LevelMatchCards;

