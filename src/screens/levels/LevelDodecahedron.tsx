import React, { useEffect, useRef, useCallback } from 'react';
import {
  TouchableWithoutFeedback,
  GestureResponderEvent,
  PixelRatio,
} from 'react-native';
import { THREE, Renderer } from 'expo-three';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import styled from 'styled-components/native';

import { Level } from 'utils/interfaces';
import { getLevelDimensions } from 'utils/getDimensions';
import colors from 'res/colors';
import styles from 'res/styles';
import LevelCounter from 'components/LevelCounter';

const { width: levelWidth, height: levelHeight } = getLevelDimensions();
const getNow = global.nativePeformanceNow || Date.now;

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
  background-color: ${colors.background};
`;

const LevelDodecahedron: Level = (props) => {
  let timeout = -1;

  useEffect(() => () => clearTimeout(timeout), []);

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

  const rotate = (angle: number) => {
    mesh.current.rotateOnWorldAxis(
      axes[count.current % axes.length],
      angle
    );
  };

  const handleGLContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    const width = levelWidth;
    const height = levelHeight;
    const scale = PixelRatio.get();

    const renderer = new Renderer({ gl, pixelRatio: scale, width, height });
    renderer.setSize(width, height);
    renderer.setClearColor(colors.background);

    camera.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.current.position.z = 5;

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(3, 3, 3);
    scene.add(light);

    geometry.current = new THREE.DodecahedronGeometry(1.5, 0);
    const material = new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors
    });
    reset();
    mesh.current = new THREE.Mesh(geometry.current, material);
    scene.add(mesh.current);

    const update = (delta: number) => {
      rotate(rotateUnit * delta * 60);
      renderer.render(scene, camera.current);
    };

    let lastFrameTime = -1;
    const render = () => {
      const now = 0.001 * getNow();
      const delta = (now !== -1) ? (now - lastFrameTime) : 1/60;

      timeout = requestAnimationFrame(render);
      update(delta);
      renderer.render(scene, camera.current);
      gl.endFrameEXP();

      lastFrameTime = now;
    };
    render();
  }, []);

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn}>
      <LevelContainer>
        <GLView
          style={{ width: levelWidth, height: levelHeight }}
          onContextCreate={handleGLContextCreate}
        />
        <LevelCounter count={numCoinsFound} />
      </LevelContainer>
    </TouchableWithoutFeedback>
  );
};

export default LevelDodecahedron;
