import React from "react";
import { View, Text, StyleSheet } from "react-native";

const KanbanNavBar = () => {
  return (
    <View style={styles.navBar}>
      <Text style={styles.title}>KANBAN</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: "#2f4382",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3, // sombra
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default KanbanNavBar;
