import React, { FunctionComponent, memo } from 'react';
import { SafeAreaView, View, LayoutChangeEvent, StyleSheet } from 'react-native';
import colors from 'res/colors';
import styled from 'styled-components/native';

// const View = styled.View`
//   flex: 1;
//   height: 100%;
//   width: 100%;
//   background-color: red;
//   position: absolute;
//   opacity: 0.5;
//   z-index: 100;
// `;

// const SafeAreaView = styled.SafeAreaView`
//   flex: 1;
//   height: 100%;
//   width: 100%;
//   background-color: blue;
//   position: absolute;
//   opacity: 0.5;
//   z-index: 1;
// `;

const style = StyleSheet.create({
  view: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    opacity: 0.5,
    zIndex: 1,
    backgroundColor: colors.background
  }
})

const MeasureScreen: FunctionComponent = () => {
  const handleViewLayout = (e: LayoutChangeEvent) => {
    console.log('view:')
    console.log(e.nativeEvent.layout);
  };

  return (
    <SafeAreaView
      onLayout={handleViewLayout}
      style={[style.view]}
    />
  );
};

export default memo(MeasureScreen);
