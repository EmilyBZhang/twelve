// Level will have a dodecahedron, each side having a coin

import React from 'react';
import { View, PanResponder, PanResponderInstance } from 'react-native';
import { AR } from 'expo';
// TODO: Add types
import { View as GraphicsView } from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import { getLevelDimensions } from 'utils/getDimensions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import colors from 'assets/colors';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const LevelDodecaheron: Level = (props) => {

  const numCoinsFound = props.coinsFound.size;
  const twelve = numCoinsFound === 12;

  return (
    <LevelContainer>
      <LevelCounter count={numCoinsFound} />
      <LevelText hidden={twelve}>twelve</LevelText>
      {coinPositions.map((coinPosition, index: number) => (
        <View
          key={String(index)}
          style={{position: 'absolute', ...coinPosition}}
        >
          <Coin
            found={props.coinsFound.has(index)}
            onPress={() => props.onCoinPress(index)}
          />
        </View>
      ))}
    </LevelContainer>
  );
};

interface TestProps {
  _panResponder: any;
}

class App extends React.Component {
  _panResponder: PanResponderInstance;
  renderer: ExpoTHREE.Renderer;
  scene: ExpoTHREE.THREE.Scene;
  camera: ExpoTHREE.THREE.Camera;
  cube: THREE.Mesh;
  constructor(props) {
    super(props);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => true,
      onStartShouldSetPanResponderCapture: (e, gestureState) => true,
      onMoveShouldSetPanResponder: (e, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
      onPanResponderTerminationRequest: (e, gestureState) => true,
      onShouldBlockNativeResponder: (e, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        // setWindowsillActive(true);
      },
      onPanResponderMove: (e, gestureState) => {
        // console.log(e.nativeEvent);
        // console.log(gestureState);
        this.cube.rotation.y += gestureState.vx;
        this.cube.rotation.x += gestureState.vy;
        console.log(this.cube.up);
        // new ExpoTHREE.THREE.Vector3(1, 0, 0);
        // new ExpoTHREE.THREE.Vector3(1, 0, 0);
        // this.cube.rotateOnAxis()
        console.log(this.cube.rotation);
        // const dy = calcDy(windowOffset + gestureState.dy);
        // Animated.event([{dy: translateYAnim}])({dy});
      },
      onPanResponderRelease: (e, gestureState) => {
        // setWindowsillActive(false);
        // const dy = calcDy(windowOffset + gestureState.dy);
        // setWindowOffset(dy);
      },
      onPanResponderTerminate: (e, gestureState) => {
        // setWindowsillActive(false);
        // const dy = calcDy(windowOffset + gestureState.dy);
        // setWindowOffset(dy);
      },
    });
  }
  // componentWillMount() {
  //   THREE.suppressExpoWarnings();
  // }

  render() {
    // Create an `ExpoGraphics.View` covering the whole screen, tell it to call our
    // `onContextCreate` function once it's initialized.
    return (<>
      <View
        {...this._panResponder.panHandlers}
        style={{
          position: 'absolute',
          width: levelWidth,
          height: levelHeight,
          zIndex: 1
        }}
      >
        <LevelContainer color={'transparent'}>
          <LevelText>Test</LevelText>
        </LevelContainer>
      </View>
      <GraphicsView
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
      />
    </>);
  }

  // This is called by the `ExpoGraphics.View` once it's initialized
  onContextCreate = async ({
    gl,
    canvas,
    width,
    height,
    scale: pixelRatio,
  }) => {
    this.renderer = new ExpoTHREE.Renderer({ gl, pixelRatio, width, height });
    this.renderer.setClearColor(colors.background)
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const material = new THREE.MeshPhongMaterial({
      color: '#ff0000',
    });
    
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.scene.add(new THREE.AmbientLight('#404040'));

    const light = new THREE.DirectionalLight('#ffffff', 0.5);
    light.position.set(3, 3, 3);
    this.scene.add(light);
  };

  onRender = delta => {
    // this.cube.rotation.x += 3.5 * delta;
    // this.cube.rotation.y += 2 * delta;
    // this.cube.rotation.z += delta;
    this.renderer.render(this.scene, this.camera);
  };
}


export default App//LevelDodecaheron;
