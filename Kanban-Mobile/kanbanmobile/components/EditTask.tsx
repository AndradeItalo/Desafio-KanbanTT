// EditTask.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Button, StyleSheet, TextInput, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Importe o componente de ícone

interface Item {
  key: string;
  title: string;
  listId: string;
}

interface Option {
  label: string;
  value: string;
}

const statusOptions: Option[] = [
  { label: 'To Do', value: 'todoData' },
  { label: 'In Progress', value: 'inProgressData' },
  { label: 'Done', value: 'doneData' },
];

interface EditTaskProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (fromList: Item[], toList: Item[], taskKey: string, fromListName: string, toListName: string, taskData: Item) => void;
  currentItem: Item;
  kanbanData: {
    todoData: Item[];
    inProgressData: Item[];
    doneData: Item[];
  };
}

const EditTask: React.FC<EditTaskProps> = ({ isVisible, onClose, onSave, currentItem, kanbanData }) => {
  const [selectedValue, setSelectedValue] = useState(currentItem.listId);
  const [taskName, setTaskName] = useState('');

  const handleNameChange = (text: string) => {
    setTaskName(text);
  };

  const handleStatusChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleSave = () => {
    const newStatus = selectedValue === undefined ? currentItem.listId : selectedValue;
    setSelectedValue(newStatus);

    const taskData = { key: currentItem.key, title: taskName, listId: selectedValue };
    let fromList: Item[] = [];
    let toList: Item[] = [];
    let fromListName = '';
    let toListName = '';

    switch (currentItem.listId) {
      case 'todoData':
        fromList = kanbanData.todoData;
        fromListName = "todoData";
        break;
      case "inProgressData":
        fromList = kanbanData.inProgressData;
        fromListName = "inProgressData";
        break;
      case "doneData":
        fromList = kanbanData.doneData;
        fromListName = "doneData";
        break;
      default:
        break;
    }

    switch (selectedValue) {
      case 'todoData':
        toList = kanbanData.todoData;
        toListName = "todoData";
        break;
      case "inProgressData":
        toList = kanbanData.inProgressData;
        toListName = "inProgressData";
        break;
      case "doneData":
        toList = kanbanData.doneData;
        toListName = "doneData";
        break;
      default:
        break;
    }

    onSave(fromList, toList, currentItem.key, fromListName, toListName, taskData);
    setTaskName('');
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={{marginTop: 30}}>
        <View style={styles.toast}>
          <FontAwesome name="edit" size={24} color="black" style={styles.editIcon} />
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Type title task"
              value={taskName}
              onChangeText={handleNameChange}
            />
          </View>
          <View style={styles.row}>
            <FontAwesome name="exchange" size={24} color="black" style={styles.editIcon} />
            <View style={styles.columnPicker}>
              {statusOptions.map(option => (
                <TouchableOpacity 
                  key={option.value} 
                  onPress={() => handleStatusChange(option.value)}
                  style={[styles.optionButton, option.value === selectedValue && styles.selectedOptionButton]}
                >
                  <Text>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  toast: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2f4382',
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    marginLeft: 10,
  },
  input: {
    borderColor: '#a9a9a9',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 15,
    flex: 1,
  },
  editIcon: {
    marginRight: 10,
    marginBottom:10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  columnPicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButton: {
    padding: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  selectedOptionButton: {
    backgroundColor: '#2196F3',
  },
});

export default EditTask;
