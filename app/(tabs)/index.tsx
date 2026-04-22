import SwipableRow from "@/components/SwipableRow";
import React, { useState } from "react";
import { View } from "react-native";

const HomeScreen = () => {
  const [items, setItems] = useState([
    { id: 1, title: "Item1" },
    { id: 2, title: "Item2" },
  ]);

  const removeItem = (id: number) => {
    setItems((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {items.map((item) => (
        <SwipableRow key={item.id} id={item.id} onDelete={removeItem} />
      ))}
    </View>
  );
};

export default HomeScreen;
