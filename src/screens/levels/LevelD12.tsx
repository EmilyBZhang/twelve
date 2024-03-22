import React, { useRef } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from 'react-native';
import {
  State,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  RotationGestureHandler,
  RotationGestureHandlerGestureEvent,
  RotationGestureHandlerStateChangeEvent,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import ExpoTHREE, { THREE } from 'expo-three';
import { View as GraphicsView, ContextCreateProps } from 'expo-graphics';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

interface Point {
  x: number;
  y: number;
}

const axes = {
  x: new THREE.Vector3(0, 1, 0),
  y: new THREE.Vector3(1, 0, 0),
  z: new THREE.Vector3(0, 0, -1),
};

const radPerPixel = Math.PI / levelWidth;

const LevelContainer = styled.View`
  position: absolute;
  top: ${styles.levelNavHeight}px;
  width: ${levelWidth}px;
  height: ${levelHeight}px;
  background-color: ${colors.background};
`;

const LevelD12: Level = (props) => {

  const renderer = useRef<ExpoTHREE.Renderer>();
  const scene = useRef<THREE.Scene>(new THREE.Scene());
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const camera = useRef<THREE.Camera>(new THREE.Camera());
  const geometry = useRef<THREE.Geometry>(new THREE.Geometry());
  const mesh = useRef<THREE.Mesh>(new THREE.Mesh());
  const count = useRef<number>(0);

  const panRef = useRef<PanGestureHandler | null>(null);
  const currTranslation = useRef<Point>({ x: 0, y: 0 });
  const rotationRef = useRef<RotationGestureHandler | null>(null);
  const currRotation = useRef<number>(0);
  const tapRef = useRef<TapGestureHandler | null>(null);

  const numCoinsFound = props.coinsFound.size;

  const handleTap = (e: TapGestureHandlerGestureEvent) => {
    if (e.nativeEvent.state !== State.ACTIVE) return;
    const { x: locationX, y: locationY } = e.nativeEvent;
    const x = (locationX / levelWidth) * 2 - 1;
    const y = -(locationY / levelHeight) * 2 + 1;
    raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera.current);

    const intersects = raycaster.current.intersectObject(mesh.current);
    if (intersects.length) {
      const index = intersects[0].faceIndex!;
      const hex = `#${geometry.current.faces[index].color.getHexString()}`;
      if (hex === colors.badCoin) return reset();

      props.onCoinPress(count.current);
      count.current++;

      const firstIndex = index - (index % 3);
      for (let i = 0; i < 3; i++) {
        geometry.current.faces[firstIndex + i].color.setStyle(colors.badCoin);
      }
      geometry.current.colorsNeedUpdate = true;
    }
  };

  const reset = () => {
    props.setCoinsFound();
    count.current = 0;
    geometry.current.faces.forEach(face => {
      face.color.setStyle(colors.coin);
    });
    geometry.current.colorsNeedUpdate = true;
  };

  const rotate = (axis: THREE.Vector3, angle: number) => {
    mesh.current.rotateOnWorldAxis(axis, angle);
  };

  const handleContextCreate = (props: ContextCreateProps) => {
    const { gl, scale: pixelRatio } = props;
    const width = levelWidth;
    const height = levelHeight;

    renderer.current = new ExpoTHREE.Renderer({gl, pixelRatio, width, height});
    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.current.position.z = 5;

    // TODO: Add d12 texture

    // geometry.current = new THREE.DodecahedronGeometry(1.5, 0);
    geometry.current = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const texture = new THREE.TextureLoader().load('');
    const materials = [
      new THREE.MeshLambertMaterial({ color: 0xff0000 }),
      new THREE.MeshLambertMaterial({ color: 0x808000 }),
      new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
      new THREE.MeshLambertMaterial({ color: 0x008080 }),
      new THREE.MeshLambertMaterial({ color: 0x0000ff }),
      new THREE.MeshLambertMaterial({ color: 0x800080 }),
    ];
    // const material = new THREE.MeshLambertMaterial({
    //   vertexColors: THREE.FaceColors
    // });
    const material = new THREE.MeshLambertMaterial({
      // map: texture,
      wireframe: true,
    });
    // reset();

    mesh.current = new THREE.Mesh(geometry.current, material);
    scene.current.add(mesh.current);

    scene.current.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(3, 3, 3);
    scene.current.add(light);
  };

  const handleGLRender = (delta: number) => {
    if (!renderer.current) return;
    renderer.current.render(scene.current, camera.current);
  };

  const handlePanGestureEvent = (e: PanGestureHandlerGestureEvent) => {
    const dx = e.nativeEvent.translationX - currTranslation.current.x;
    const dy = e.nativeEvent.translationY - currTranslation.current.y;
    rotate(axes.x, dx * radPerPixel);
    rotate(axes.y, dy * radPerPixel);
    currTranslation.current.x = e.nativeEvent.translationX;
    currTranslation.current.y = e.nativeEvent.translationY;
  };

  const handlePanHandlerStateChange = (e: PanGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.oldState === State.ACTIVE) {
      currTranslation.current.x = 0;
      currTranslation.current.y = 0;
    }
  };

  const handleRotationGestureEvent = (e: RotationGestureHandlerGestureEvent) => {
    rotate(axes.z, e.nativeEvent.rotation - currRotation.current);
    currRotation.current = e.nativeEvent.rotation;
  };

  const handleRotationHandlerStateChange = (e: RotationGestureHandlerStateChangeEvent) => {
    if (e.nativeEvent.oldState === State.ACTIVE) currRotation.current = 0;
  };

  return (
    <PanGestureHandler
      ref={panRef}
      simultaneousHandlers={[rotationRef, tapRef]}
      onGestureEvent={handlePanGestureEvent}
      onHandlerStateChange={handlePanHandlerStateChange}
      maxPointers={1}
    >
      <RotationGestureHandler
        ref={rotationRef}
        simultaneousHandlers={[panRef, tapRef]}
        onGestureEvent={handleRotationGestureEvent}
        onHandlerStateChange={handleRotationHandlerStateChange}
      >
        <TapGestureHandler
          ref={tapRef}
          simultaneousHandlers={[panRef, rotationRef]}
          // onHandlerStateChange={handleTap}
        >
          <LevelContainer>
            <LevelCounter count={numCoinsFound} />
            <GraphicsView
              onContextCreate={handleContextCreate}
              onRender={handleGLRender}
            />
          </LevelContainer>
        </TapGestureHandler>
      </RotationGestureHandler>
    </PanGestureHandler>
  );
};

export default LevelD12;
