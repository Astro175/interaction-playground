import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const THRESHOLD = -(SCREEN_WIDTH * 0.4);

const SwipableRow = ({
  onDelete,
  id,
}: {
  onDelete: (id: number) => void;
  id: number;
}) => {
  const sv = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      sv.value = Math.min(event.translationX, 0);
    })
    .onEnd((event) => {
      if (event.translationX < THRESHOLD || event.velocityX < -1000) {
        sv.value = withTiming(
          -SCREEN_WIDTH,
          {
            duration: 500,
            easing: Easing.out(Easing.poly(4)),
            reduceMotion: ReduceMotion.System,
          },
          () => {
            runOnJS(onDelete)(id);
          },
        );
      } else {
        sv.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sv.value }],
  }));

  const redBackgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sv.value, [0, THRESHOLD], [0, 1]),
  }));

  return (
    <View style={{ width: "100%", padding: 10 }}>
      <Animated.View
        style={[styles.redBackground, redBackgroundAnimatedStyle]}
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.box, animatedStyle]}></Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 70,
    width: "100%",
    backgroundColor: "#b58df1",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  redBackground: {
    position: "absolute",
    height: 70,
    width: "100%",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 16,
  },
});

export default SwipableRow;
