import React from "react";
import { StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const Button = () => {
  const sv = useSharedValue(1);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      sv.value = withTiming(0.95, {
        duration: 100,
        easing: Easing.exp,
        reduceMotion: ReduceMotion.System,
      });
    })
    .onEnd(() => {
      sv.value = withSpring(1, {
        stiffness: 100,
        damping: 10,
        mass: 1,
        overshootClamping: undefined,
        energyThreshold: 6e-9,
        velocity: 0,
        reduceMotion: ReduceMotion.System,
      });
    });

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sv.value }],
  }));
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[buttonAnimatedStyle, styles.button]}>
        <Text style={styles.text}>Press Me</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#004AAD",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Button;
