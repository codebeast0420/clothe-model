import { decode, encode } from "base-64";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import React, { useEffect, useRef } from "react";
import {
  TouchableWithoutFeedback,
  Text,
  View,
  Animated,
  PanResponder,
} from "react-native";
import {
  AmbientLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from "three";
import { Asset } from "expo-asset";
import { TweenMax } from "gsap";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

let model;

export default function App() {
  let timeout;

  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  const move = (distance) => {
    TweenMax.to(model.rotation, 0.2, {
      y: model.rotation.y + distance,
    });
  };

  const pan = useRef(new Animated.ValueXY()).current;

  let m = 0;
  let test = 0.0;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
        listener: (event) => {
          console.log(pan.x._value);
          if (pan.x._value > 0) model.rotation.z += 0.12;
          if (pan.x._value < 0) model.rotation.z -= 0.12;
          // if (pan.y._value > 0) model.rotation.x += 0.12;
          // if (pan.y._value < 0) model.rotation.x -= 0.12;
        },
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const RotateValue = pan.x.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={{ backgroundColor: "white", height: "100%", width: "100%" }}>
      <Animated.View
        style={{
          height: '100%',
          backgroundColor: "white",
          width: "100%",
        }}
        {...panResponder.panHandlers}
      >
        <GLView
          style={{ flex: 1 }}
          onContextCreate={async (gl) => {
            const { drawingBufferWidth: width, drawingBufferHeight: height } =
              gl;

            const renderer = new Renderer({ gl });
            renderer.setSize(width, height);

            const camera = new PerspectiveCamera(
              120,
              width / height,
              0.01,
              1000
            );
            camera.position.z = 5;
            camera.position.y = 2.5;
            const asset = Asset.fromModule(
              require("./assets/weapons/Jess/uploads_files_1937288_Jess_Casual_Walking_001.obj")
            );
            // const mtlAsset = Asset.fromModule(
            //   require("./assets/weapons/test/DeadTree.mtl")
            // );
            await asset.downloadAsync();
            const scene = new Scene();

            const ambientLight = new AmbientLight(0x101010);
            scene.add(ambientLight);

            const pointLight = new PointLight(0xffffff, 2, 1000, 1);
            pointLight.position.set(0, 200, 200);
            scene.add(pointLight);

            const spotLight = new SpotLight(0xffffff, 0.5);
            spotLight.position.set(0, 500, 100);
            spotLight.lookAt(scene.position);
            scene.add(spotLight);
            // const mtl = new MTLLoader();
            const loader = new OBJLoader();
            // mtl.load(
            //   "./assets/weapons/Jess/400$.mtl" || "",
            //   (materials) => {
            //     materials.preload();
            //     loader.setMaterials(materials);
                loader.load(
                  asset.uri || "",
                  (gltf) => {
                    model = gltf;
                    model.scale.set(0.005, 0.005, 0.005);
                    model.position.setY(-2);
                    model.rotation.x = 4.8; 
                    scene.add(model);
                  },
                  (xhr) => {
                    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
                  },
                  (error) => {
                    console.error("An error happened", error);
                  }
                );
              // },
              (xhr) => {
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
              },
              (error) => {
                console.error("An error happened", error);
              }
            // );
            function update() {
              // if (model) model.rotation.y += 0.004;
            }

            const render = () => {
              timeout = requestAnimationFrame(render);
              update();
              renderer.render(scene, camera);
              gl.endFrameEXP();
            };
            render();
          }}
        ></GLView>
      </Animated.View>
      {/* <View
        style={{
          display: "flex",
          backgroundColor: "black",
          height: 300,
          width: "100%",
        }}
      >
        <TouchableWithoutFeedback onPressIn={() => move(-0.2)}>
          <Text
            style={{
              fontSize: 36,
              backgroundColor: "white",
              height: 40,
              width: "50%",
            }}
          >
            UP
          </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPressIn={() => move(0.2)}>
          <Text
            style={{
              fontSize: 36,
              marginLeft: "50%",
              backgroundColor: "white",
              height: 40,
              width: "50%",
            }}
          >
            DOWN
          </Text>
        </TouchableWithoutFeedback>
      </View> */}
    </View>
  );
}
