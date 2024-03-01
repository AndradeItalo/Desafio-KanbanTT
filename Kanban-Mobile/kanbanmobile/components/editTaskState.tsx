// EditTaskState.tsx
import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';

interface EditTaskStateProps {
  isVisible: boolean;
  onClose: () => void;
  onSaveState: (selectedState: string) => void;
}

const EditTaskState: React.FC<EditTaskStateProps> = ({ isVisible, onClose, onSaveState }) => {
  const [selectedState, setSelectedState] = useState('');

  const handleSaveState = () => {
    onSaveState(selectedState);
    setSelectedState('');
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Update Task State</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setSelectedState('todoData')}
          >
            <Text style={styles.textStyle}>To Do</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setSelectedState('inProgressData')}
          >
            <Text style={styles.textStyle}>In Progress</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setSelectedState('doneData')}
          >
            <Text style={styles.textStyle}>Done</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonClose]} onPress={handleSaveState}>
            <Text style={styles.textStyle}>Save</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonClose]} onPress={onClose}>
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default EditTaskState;
