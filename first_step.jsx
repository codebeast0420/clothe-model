import { decode, encode } from "base-64";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer } from "expo-three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import React, { useEffect } from "react";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
  Text,
  View,
  Alert,
} from "react-native";
import {
  AmbientLight,
  PerspectiveCamera,
  SphereGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PointLight,
  Scene,
  SpotLight,
} from "three";
import { Asset } from "expo-asset";
import { TweenMax } from "gsap";
import GestureRecognizer, {
  swipedirections,
} from "react-native-swipe-gestures";

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

  const swipeUp = () => {
    TweenMax.to(model.rotation, 0.2, {
      x: model.rotation.x + 0.2,
    });
  };

  const swipeDown = () => {
    TweenMax.to(model.rotation, 0.2, {
      x: model.rotation.x - 0.2,
    });
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

  return (
    <GestureRecognizer
      onSwipeUp={swipeUp}
      onSwipeDown={swipeDown}
      config={config}
      style={{
        flex: 1,
      }}
    >
      <View style={{ backgroundColor: "white", height: 1000, width: "100%" }}>
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
            camera.position.y = 1.5;
            const asset = Asset.fromModule(
              require("./assets/weapons/wholebody/FinalBaseMesh.gltf")
            );
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

            const loader = new GLTFLoader();
            loader.load(
              asset.uri || "",
              (gltf) => {
                model = gltf.scene;
                model.scale.set(0.5, 0.5, 0.5);
                model.position.setY(-3);
                scene.add(model);
              },
              (xhr) => {
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
              },
              (error) => {
                console.error("An error happened", error);
              }
            );

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
        <View
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
        </View>
      </View>
    </GestureRecognizer>
  );
}




//////////
import { decode, encode } from "base-64";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { Renderer } from "expo-three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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
import GestureRecognizer from "react-native-swipe-gestures";

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

  const swipeUp = () => {
    TweenMax.to(model.rotation, 0.2, {
      x: model.rotation.x + 0.2,
    });
  };

  const swipeDown = () => {
    TweenMax.to(model.rotation, 0.2, {
      x: model.rotation.x - 0.2,
    });
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const pan = useRef(new Animated.ValueXY()).current;

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
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    // <GestureRecognizer
    //   onSwipeUp={swipeUp}
    //   onSwipeDown={swipeDown}
    //   config={config}
    //   style={{
    //     flex: 1,
    //   }}
    // >
      <View style={{ backgroundColor: "white", height: 1000, width: "100%" }}>
        <Animated.View
          style={{
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
            height: 600,
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
              camera.position.y = 1.5;
              const asset = Asset.fromModule(
                require("./assets/weapons/wholebody/FinalBaseMesh.gltf")
              );
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

              const loader = new GLTFLoader();
              loader.load(
                asset.uri || "",
                (gltf) => {
                  model = gltf.scene;
                  model.scale.set(0.5, 0.5, 0.5);
                  model.position.setY(-3);
                  scene.add(model);
                },
                (xhr) => {
                  console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
                },
                (error) => {
                  console.error("An error happened", error);
                }
              );

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
        <View
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
        </View>
      </View>
    // </GestureRecognizer>
  );
}



//////////////////////////

import { decode, encode } from "base-64";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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

  const swipeUp = () => {
    TweenMax.to(model.rotation, 0.2, {
      x: model.rotation.x + 0.2,
    });
  };

  const swipeDown = () => {
    TweenMax.to(model.rotation, 0.2, {
      x: model.rotation.x - 0.2,
    });
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const pan = useRef(new Animated.ValueXY()).current;

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
          console.log(pan.y);
          model.rotation.y += parseInt(JSON.stringify(pan.y)) * 0.001;
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
    <View style={{ backgroundColor: "white", height: 1000, width: "100%" }}>
      <Animated.View
        style={{
          height: 600,
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
            camera.position.y = 1.5;
            const asset = Asset.fromModule(
              require("./assets/weapons/wholebody/FinalBaseMesh.gltf")
            );
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

            const loader = new GLTFLoader();
            loader.load(
              asset.uri || "",
              (gltf) => {
                model = gltf.scene;
                model.scale.set(0.5, 0.5, 0.5);
                // model.position.setY(-3);
                scene.add(model);
              },
              (xhr) => {
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
              },
              (error) => {
                console.error("An error happened", error);
              }
            );

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
      <View
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
      </View>
    </View>
  );
}
