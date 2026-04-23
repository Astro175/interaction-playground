import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const BottomSheet = () => {
  const sv = useSharedValue(SCREEN_HEIGHT * 0.85);
  const startingPoint = useSharedValue(SCREEN_HEIGHT * 0.85);
  console.log(startingPoint.value, "Starting value");

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      sv.value = Math.max(
        Math.min(
          startingPoint.value + event.translationY,
          SCREEN_HEIGHT * 0.85,
        ),
        0,
      );
    })
    .onEnd(() => {
      startingPoint.value = sv.value;
      if (startingPoint.value > SCREEN_HEIGHT * 0.8) {
        sv.value = withSpring(SCREEN_HEIGHT * 0.85);
        startingPoint.value = SCREEN_HEIGHT * 0.85;
      } else if (startingPoint.value < SCREEN_HEIGHT * 0.3) {
        sv.value = withSpring(0);
        startingPoint.value = 0;
      } else if (startingPoint.value < SCREEN_HEIGHT * 0.8) {
        sv.value = withSpring(SCREEN_HEIGHT * 0.5);
        startingPoint.value = SCREEN_HEIGHT * 0.5;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sv.value }],
  }));
  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sv.value, [SCREEN_HEIGHT, 0], [0, 1]),
  }));

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[styles.backdrop, backdropAnimatedStyle]}
      ></Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, animatedStyle]}>
          <View style={styles.handle} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "black",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
});
