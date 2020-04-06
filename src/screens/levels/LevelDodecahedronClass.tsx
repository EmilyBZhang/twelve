// Level will have a dodecahedron, each side having a coin

import React from 'react';
import { View, PanResponder, PanResponderInstance, Text } from 'react-native';
import { GLView } from 'expo-gl';
// TODO: Add types
import { View as GraphicsView, ContextCreateProps } from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';

import { Level } from 'utils/interfaces';
import coinPositions from 'utils/coinPositions';
import getDimensions, { getLevelDimensions } from 'utils/getDimensions';
import LevelContainer from 'components/LevelContainer';
import Coin from 'components/Coin';
import LevelText from 'components/LevelText';
import LevelCounter from 'components/LevelCounter';
import colors from 'assets/colors';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const { width: windowWidth, height: windowHeight } = getDimensions();

const dummyFaceColors = [
  [0, 0, 0],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 1],
  [1, 0, 0],
  [1, 0, 1],
  [1, 1, 0],
  [1, 1, 1],
  [0.5, 0.5, 0.5],
  [1, 0.5, 0.5],
  [0.5, 1, 0.5],
  [0.5, 0.5, 1],
];

const rubiksCubeColors = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 0],
  [1, 0.5, 0],
  [0, 0, 1],
  [0, 0.5, 0]
];

const d12Colors = [
  [1, 1, 1],
  [1, 0.5, 0.5],
  [1, 0, 0],
  [1, 165/255, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0.5, 0],
  [0, 0.5, 0.5],
  [0, 0, 1],
  [59/255, 0, 130/255],
  [0.5, 0, 0.5],
  [0, 0, 0],
];

// const LevelDodecaheron: Level = (props) => {

//   const numCoinsFound = props.coinsFound.size;
//   const twelve = numCoinsFound === 12;

//   return (<>
//     <View
//       {...this._panResponder.panHandlers}
//       style={{
//         position: 'absolute',
//         width: levelWidth,
//         height: levelHeight,
//         zIndex: 1
//       }}
//     >
//       <LevelContainer color={'transparent'}>
//         {/* <LevelText>Test</LevelText> */}
//         <Text>{(x / Math.PI) % 2}π</Text>
//         <Text>{(y / Math.PI) % 2}π</Text>
//         <Text>{(z / Math.PI) % 2}π</Text>
//       </LevelContainer>
//     </View>
//     <GraphicsView
//       onContextCreate={this.onContextCreate}
//       onRender={this.onRender}
//     />
//   </>);
// };

interface TestProps {
  _panResponder: any;
}

// TODO: Convert to function component
class App extends React.Component {
  _panResponder: PanResponderInstance;
  renderer: ExpoTHREE.Renderer | null = null;
  scene: ExpoTHREE.THREE.Scene = new THREE.Scene();
  camera: ExpoTHREE.THREE.Camera = new THREE.Camera();
  geometry: THREE.Geometry = new THREE.Geometry();
  mesh: THREE.Mesh = new THREE.Mesh();
  raycaster: THREE.Raycaster = new THREE.Raycaster();
  count = 0;
  // TODO: Change any
  constructor(props: any) {
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
        const { locationX, locationY } = e.nativeEvent;
        const x = (locationX / windowWidth) * 2 - 1;
        const y = -(locationY / windowHeight) * 2 + 1;
        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        const intersects = this.raycaster.intersectObjects([this.mesh]);
        if (intersects.length) {
          const index = intersects[0].faceIndex!;
          const hex = this.geometry.faces[index].color.getHex();
          if (hex === 0xff0000) {
            this.reset();
            return;
          };
          this.count++;
          const firstIndex = index - (index % 3);

          for (let i = 0; i < 3; i++) {
            this.geometry.faces[firstIndex + i].color.setRGB(1, 0, 0);
          }
          this.geometry.colorsNeedUpdate = true;
          // intersects[ 0 ].face.color.setRGB(1, 1, 1);
          // intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
          
          props.onCoinPress(this.count);
        }
      },
      onPanResponderMove: (e, gestureState) => {
        // console.log(e.nativeEvent);
        // console.log(gestureState);
        // this.mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), gestureState.vy);
        // this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), gestureState.vx);
        // console.log(this.mesh.up);
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

  reset = () => {
    this.count = 0;
    this.props.setCoinsFound(new Set());
    this.geometry.faces.forEach((face, index) => {
      face.color.setStyle(colors.coin);
    });
    this.geometry.colorsNeedUpdate = true;
  };

  render() {
    const { x, y, z } = this.mesh.rotation;
    // Create an `ExpoGraphics.View` covering the whole screen, tell it to call our
    // `onContextCreate` function once it's initialized.
    return (<>
      <View
        {...this._panResponder.panHandlers}
        style={{
          position: 'absolute',
          width: levelWidth,
          height: levelHeight,
          zIndex: 1,
        }}
        pointerEvents={'box-only'}
      >
        <LevelContainer color={'transparent'}>
          <LevelCounter count={this.props.coinsFound.size} />
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
  }: ContextCreateProps) => {
    this.renderer = new ExpoTHREE.Renderer({ gl, pixelRatio, width, height });
    this.renderer.setClearColor(colors.background)
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.geometry = new THREE.DodecahedronGeometry(1.5, 0);
    
    const material = new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors
    });
    this.reset();
    
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.scene.add(this.mesh);

    // this.scene.add(new THREE.AmbientLight('#404040'));
    this.scene.add(new THREE.AmbientLight('#808080'));
    // this.scene.add(new THREE.AmbientLight('#ffffff'));

    const light = new THREE.DirectionalLight('#ffffff', 0.5);
    light.position.set(3, 3, 3);
    this.scene.add(light);

    
  };

  rotate = () => {
    const axes = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ];
    this.mesh.rotateOnWorldAxis(axes[this.count % axes.length], Math.PI / 180)
  };

  onRender = (delta: number) => {
    if (!this.renderer) return;
    this.rotate();
    this.renderer.render(this.scene, this.camera);
    this.setState({});
  };
}


export default App//LevelDodecaheron;
