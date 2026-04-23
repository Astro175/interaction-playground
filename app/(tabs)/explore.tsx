import CardStack from "@/components/CardStack";
import React, { useState } from "react";
import { View } from "react-native";

const ExploreScreen = () => {
  const [data, setData] = useState([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ]);

  const removeCard = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const focusedCards = data.slice(0, 3);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {focusedCards.map((card, index) => (
        <CardStack
          key={card.id}
          id={card.id}
          onDelete={removeCard}
          index={index}
          zIndex={focusedCards.length - index}
        />
      ))}
    </View>
  );
};

export default ExploreScreen;
