import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; 

interface HeaderProps {
  text: string;
  onPressAdd: () => void;
}

const Header: React.FC<HeaderProps> = ({ text, onPressAdd }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.texttitle}>
          {text}
          <TouchableOpacity style={styles.button} onPress={onPressAdd}>
            <FontAwesome name="plus-circle" size={20} color="white" />
          </TouchableOpacity>
        </Text>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // sombra
    height: 110,
    shadowOffset: {
        width: 0,
        height: 1,
      },
  },
  texttitle: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    marginRight: 10,
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6c9ef1',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default Header;
