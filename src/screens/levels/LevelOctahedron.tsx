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
`;

const LevelOctahedron: Level = (props) => {

  const renderer = useRef<ExpoTHREE.Renderer>();
  const scene = useRef<THREE.Scene>(new THREE.Scene());
  const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const camera = useRef<THREE.Camera>(new THREE.Camera());
  const geometry = useRef<THREE.Geometry>(new THREE.Geometry());
  const mesh = useRef<THREE.Mesh>(new THREE.Mesh());
  const count = useRef<number>(0);

  const numCoinsFound = props.coinsFound.size;

  const handlePressIn = (e: GestureResponderEvent) => {
    if (!mesh.current.children.length) return;
    const { locationX, locationY } = e.nativeEvent;
    const x = (locationX / levelWidth) * 2 - 1;
    const y = -(locationY / levelHeight) * 2 + 1;
    raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera.current);

    const edges = mesh.current.children[0] as THREE.LineSegments;
    const intersects = raycaster.current.intersectObject(edges);
    console.log(intersects.length);
    if (intersects.length) {
      edges.material = new THREE.LineBasicMaterial( { vertexColors: THREE.NoColors, color: 0xff0000, linewidth: 2 } );
      console.log(edges.geometry.vertices);
      return;
      console.log(intersects.length);
      console.log(intersects);
      const index = intersects[0].faceIndex!;
      // const hex = `#${geometry.current.faces[index].color.getHexString()}`;
      // if (hex === colors.badCoin) return reset();

      props.onCoinPress(count.current);
      count.current++;

      // const firstIndex = index - (index % 3);
      // for (let i = 0; i < 3; i++) {
      //   geometry.current.faces[firstIndex + i].color.setStyle(colors.badCoin);
      // }
      // geometry.current.
      geometry.current.faces[index].color.setStyle(colors.badCoin);
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

  const handleContextCreate = (props: ContextCreateProps) => {
    const { gl, scale: pixelRatio } = props;
    const width = levelWidth;
    const height = levelHeight;

    renderer.current = new ExpoTHREE.Renderer({ gl, pixelRatio, width, height });
    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.current.position.z = 5;

    geometry.current = new THREE.OctahedronGeometry(1.5, 0);
    const material = new THREE.MeshLambertMaterial({
      vertexColors: THREE.FaceColors
    });
    reset();

    mesh.current = new THREE.Mesh(geometry.current, material);
    scene.current.add(mesh.current);
    // var edgeGeometry = new THREE.EdgesGeometry( mesh.current.geometry ); // or WireframeGeometry
    // var edgeMaterial = new THREE.LineBasicMaterial( { color: 0xffff00, linewidth: 2 } );
    // var edges = new THREE.LineSegments( edgeGeometry, edgeMaterial );
    
    // mesh.current.add( edges );

    scene.current.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(3, 3, 3);
    scene.current.add(light);
  };

  const handleGLRender = (delta: number) => {
    if (!renderer.current) return;
    rotate(rotateUnit * delta * 60);
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

export default LevelOctahedron;
