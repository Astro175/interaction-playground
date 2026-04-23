import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const RIGHTTHRESHOLD = SCREEN_WIDTH * 0.4;
const LEFTTHRESHOLD = -SCREEN_WIDTH * 0.4;

const CardStack = ({
  id,
  index,
  onDelete,
  zIndex,
}: {
  id: number;
  index: number;
  onDelete: (id: number) => void;
  zIndex: number;
}) => {
  const sharedVerticalValue = useSharedValue(0);
  const sharedHorizontalValue = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      sharedHorizontalValue.value = event.translationX;
      sharedVerticalValue.value = event.translationY;
    })
    .onEnd((event) => {
      if (
        event.velocityX < -1000 ||
        event.velocityX > 1000 ||
        event.translationX > RIGHTTHRESHOLD ||
        event.translationX < LEFTTHRESHOLD
      ) {
        if (event.translationX > RIGHTTHRESHOLD || event.velocityX > 1000) {
          sharedHorizontalValue.value = withTiming(SCREEN_WIDTH, {}, () => {
            runOnJS(onDelete)(id);
          });
        } else if (
          event.translationX < LEFTTHRESHOLD ||
          event.velocityX < -1000
        ) {
          sharedHorizontalValue.value = withTiming(-SCREEN_WIDTH, {}, () => {
            runOnJS(onDelete)(id);
          });
        }
      } else {
        sharedHorizontalValue.value = withSpring(0);
        sharedVerticalValue.value = withSpring(0);
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotationValue = interpolate(
      sharedHorizontalValue.value,
      [-SCREEN_WIDTH, SCREEN_WIDTH],
      [-15, 15],
    );

    return {
      transform: [
        { translateY: sharedVerticalValue.value },
        { translateX: sharedHorizontalValue.value },
        { rotate: `${rotationValue}deg` },
      ],
    };
  });
  return (
    <View>
      {index === 0 ? (
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              cardAnimatedStyle,
              styles.card,
              {
                zIndex,
                transform: [{ scale: 1 - index * 0.05 }],
                top: index * 10,
              },
            ]}
          />
        </GestureDetector>
      ) : (
        <View
          style={[
            styles.card,
            {
              zIndex,
              transform: [{ scale: 1 - index * 0.05 }],
              top: index * 10,
            },
          ]}
        ></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    position: "absolute",
  },
  backCard: {
    width: 300,
    height: 400,
    backgroundColor: "red",
    borderRadius: 20,
    alignSelf: "center",
    position: "absolute",
    top: 10,
    transform: [{ scale: 0.95 }],
  },
});

export default CardStack;
