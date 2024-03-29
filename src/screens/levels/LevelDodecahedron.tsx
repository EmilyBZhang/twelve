import React, { useRef, useCallback, useEffect } from 'react';
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

const { r: goodR, g: goodG, b: goodB } = new THREE.Color(colors.coin);
const coinArray = [goodR, goodG, goodB];

const { r: badR, g: badG, b: badB } = new THREE.Color(colors.badCoinUnderlay);
const badCoinArray = [badR, badG, badB];

const LevelDodecahedron: Level = (props) => {
  const { coinsFound, onCoinPress, setCoinsFound } = props;
  const numCoinsFound = coinsFound.size;

  const { current: camera } = useRef(
    new THREE.PerspectiveCamera(75, levelWidth / levelHeight, 0.1, 1000)
  );
  const { current: geometry } = useRef(new THREE.DodecahedronGeometry(1.5, 0));
  const { current: material } = useRef(
    new THREE.MeshLambertMaterial({ vertexColors: true })
  );
  const { current: mesh } = useRef(new THREE.Mesh(geometry, material));
  const { current: raycaster } = useRef(new THREE.Raycaster());

  const coinCount = useRef(0);

  const handlePressIn = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    const x = (locationX / levelWidth) * 2 - 1;
    const y = -(locationY / levelHeight) * 2 + 1;
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObject(mesh);
    if (intersects.length) {
      const { faceIndex } = intersects[0];
      if (faceIndex != null) {
        const coinIndex = Math.floor(faceIndex / 3);
        if (coinsFound.has(coinIndex)) return reset();

        const color = geometry.getAttribute('color')?.array;
        if (color) {
          const newColor = new THREE.Float32BufferAttribute(
            color.map((value, index) =>
              index >= coinIndex * 27 && index < (coinIndex + 1) * 27
                ? badCoinArray[index % 3]
                : value
            ),
            3
          );
          geometry.setAttribute('color', newColor);
          coinCount.current += 1;
          onCoinPress(coinIndex);
        }
      }
    }
  };

  const reset = () => {
    coinCount.current = 0;
    setCoinsFound();
    const position = geometry.getAttribute('position')?.array;
    if (position) {
      const color = new THREE.Float32BufferAttribute(
        position.map((_, index) => coinArray[index % 3]),
        3
      );
      geometry.setAttribute('color', color);
    }
  };

  const rotate = (angle: number) => {
    mesh.rotateOnWorldAxis(axes[coinCount.current % axes.length], angle);
  };

  let timeout: number = -1;
  useEffect(() => {
    return () => {
      if (timeout !== -1) clearTimeout(timeout);
    };
  }, []);

  const handleGLContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    const width = levelWidth;
    const height = levelHeight;
    const scale = PixelRatio.get();

    const renderer = new Renderer({ gl, pixelRatio: scale, width, height });
    renderer.setSize(width, height);
    renderer.setClearColor(colors.background);
    camera.position.z = 5;

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(3, 3, 3);
    scene.add(light);

    reset();
    scene.add(mesh);

    const update = (delta: number) => {
      rotate(rotateUnit * delta * 60);
      renderer.render(scene, camera);
    };

    let lastFrameTime = -1;
    const render = () => {
      const now = Date.now() / 1000;
      const delta = lastFrameTime !== -1 ? now - lastFrameTime : 1 / 60;

      timeout = requestAnimationFrame(render);
      update(delta);
      renderer.render(scene, camera);
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
