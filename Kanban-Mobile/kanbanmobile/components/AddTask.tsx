// AddTask.tsx
import React, { useState } from 'react';
import { Modal, Text, Pressable, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { v4 as uuidv4 } from 'uuid'; 

type Task = {
  key: string;
  title: string;
  listId: string;
};

interface TaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (TaskData: Task) => void;
  listId: string;
}

const AddTask: React.FC<TaskModalProps> = ({ isVisible, onClose, onSave, listId }) => {
  const [titleTask, setTitle] = useState('');

  const handleSave = () => {
    const taskData = { key: uuidv4(), title: titleTask, listId: listId }; // gerar a key com uuidv4
    onSave(taskData);
    setTitle('');
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Type title task"
            value={titleTask}
            onChangeText={text => setTitle(text)}
          />
          <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleSave}>
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
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
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '100%',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#2f4382',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
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
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    marginBottom: 15,
    width: '100%',
  },
});

export default AddTask;
