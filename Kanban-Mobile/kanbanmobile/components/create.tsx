import React, { useState } from 'react';
import { Modal, Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { v4 as uuidv4 } from 'uuid'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Task = {
  id: string;
  title: string;
  statusId: string;
};

interface TaskCreate {
  isVisible: boolean;
  closeModal: () => void;
  saveChanges: (task: Task) => void;
  statusId: string;
}

const CreateTask: React.FC<TaskCreate> = ({ isVisible, closeModal, saveChanges, statusId }) => {
  const [titleTask, setTitle] = useState('');

  const handleCancel = () => {
    setTitle('');
    closeModal();
  };

  const handleSaveChanges = () => {
    if(titleTask.trim() === ''){
      closeModal();
      return;
    }

    const task = { id: uuidv4(), title: titleTask, statusId: statusId };
    saveChanges(task);
    setTitle('');
    closeModal();
  };



  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.background}>
        <View style={styles.toast}>
          <MaterialCommunityIcons name="plus-circle" size={24} color="black" style={styles.plusIcon} />
          <TextInput
            style={styles.input}
            placeholder="Type title task"
            value={titleTask}
            onChangeText={setTitle}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleSaveChanges}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  toast: {
    marginTop: '17%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: '80%', 
  },
  input: {
    borderColor: '#a9a9a9',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 15,
    flex: 1,
  },
  plusIcon: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 15, 
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '48%', 
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

});

export default CreateTask;
