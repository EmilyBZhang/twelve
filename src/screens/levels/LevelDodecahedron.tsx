import React, { useRef } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from 'react-native';
import ExpoTHREE, { THREE } from 'expo-three';
import { View as GraphicsView, ContextCreateProps } from 'expo-graphics';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'assets/colors';
import styles from 'assets/styles';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();

const axes = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, 0, 1),
];

const rotateUnit = Math.PI / 180;

const LevelContainer = styled.View`
  position: absolute;
  top: ${styles.levelNavHeight}px;
  width: ${levelWidth}px;
  height: ${levelHeight}px;
`;

const LevelDodecahedron: Level = (props) => {

  const renderer = useRef<ExpoTHREE.Renderer>();
  const scene = useRef<THREE.Scene>(new THREE.Scene());
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const camera = useRef<THREE.Camera>(new THREE.Camera());
  const geometry = useRef<THREE.Geometry>(new THREE.Geometry());
  const mesh = useRef<THREE.Mesh>(new THREE.Mesh());
  const count = useRef<number>(0);

  const numCoinsFound = props.coinsFound.size;

  const handlePressIn = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    const x = (locationX / levelWidth) * 2 - 1;
    const y = -(locationY / levelHeight) * 2 + 1;
    raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera.current);

    const intersects = raycaster.current.intersectObject(mesh.current);
    if (intersects.length) {
      const index = intersects[0].faceIndex!;
      // TODO: Find better way to compare colors
      const hex = `#${geometry.current.faces[index].color.getHexString()}`;
      if (hex === colors.badCoin) return reset();

      props.onCoinPress(count.current);
      count.current++;

      const firstIndex = index - (index % 3);
      for (let i = 0; i < 3; i++) {
        geometry.current.faces[firstIndex + i].color.setRGB(1, 0, 0);
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

  const rotate = () => {
    mesh.current.rotateOnWorldAxis(
      axes[count.current % axes.length],
      rotateUnit
    );
  };

  const handleContextCreate = (props: ContextCreateProps) => {
    const { gl, scale: pixelRatio } = props;
    const width = levelWidth;
    const height = levelHeight;

    renderer.current = new ExpoTHREE.Renderer({gl, pixelRatio, width, height});
    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.current.position.z = 5;

    geometry.current = new THREE.DodecahedronGeometry(1.5, 0);
    const material = new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors
    });
    reset();

    mesh.current = new THREE.Mesh(geometry.current, material);
    scene.current.add(mesh.current);

    scene.current.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(3, 3, 3);
    scene.current.add(light);
  };

  const handleGLRender = () => {
    if (!renderer.current) return;
    rotate();
    renderer.current.render(scene.current, camera.current);
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn}>
      <LevelContainer>
        <LevelCounter count={numCoinsFound} />
        <GraphicsView
          onContextCreate={handleContextCreate}
          onRender={handleGLRender}
        />
      </LevelContainer>
    </TouchableWithoutFeedback>
  );
};

export default LevelDodecahedron;
