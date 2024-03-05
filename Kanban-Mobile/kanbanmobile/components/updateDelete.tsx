import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


interface Task {
  id: string;
  title: string;
  statusId: string;
}

interface TaskUpdate {
  isVisible: boolean;
  closeModal: () => void;
  saveChanges: (currentList: Task[], newList: Task[], taskId: string, currentListName: string, newListName: string, taskData: Task) => void;
  currentTask: Task;
  kanbanData: {
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  };
}

interface Status {
  status: string;
  value: string;
}

const statusOptions: Status[] = [
  { status: 'To Do', value: 'todo' },
  { status: 'In Progress', value: 'inProgress' },
  { status: 'Done', value: 'done' },
];

const UpdateTask: React.FC<TaskUpdate> = ({ isVisible, closeModal, saveChanges, currentTask, kanbanData }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentTask.statusId);
  const [taskTitle, setTaskTitle] = useState('');

  const handleDelete = () => {
    // Cria uma cópia dos dados atuais
    const updatedKanbanData = { ...kanbanData };
  
    // Identifica a lista correspondente com base no statusId do currentItem
    let currentList: Task[] = [];
    let currentListName = '';
    switch (currentTask.statusId) {
      case 'todo':
        currentList = updatedKanbanData.todo;
        currentListName = 'todo';
        updatedKanbanData.todo = currentList.filter(task => task.id !== currentTask.id);
        break;
      case 'inProgress':
        currentList = updatedKanbanData.inProgress;
        currentListName = 'inProgress';
        updatedKanbanData.inProgress = currentList.filter(task => task.id !== currentTask.id);
        break;
      case 'done':
        currentList = updatedKanbanData.done;
        currentListName = 'done';
        updatedKanbanData.done = currentList.filter(task => task.id !== currentTask.id);
        break;
      default:
        return; // 
    }
  
    // Atualiza o localStorage com os dados atualizados excluindo a tarefa
    try {
      localStorage.setItem('KanbanData', JSON.stringify(updatedKanbanData));
    } catch (error) {
      // Lida com possíveis erros na atualização do localStorage
      console.error('Erro ao atualizar o localStorage:', error);
    }
  
    // Atualiza os dados na tela e no armazenamento local
    saveChanges(currentList, [], currentTask.id, currentListName, '', null);
  
    // Fecha o modal
    setTaskTitle('');
    closeModal();
  };
  
  const handleTitleChange = (text: string) => {
    setTaskTitle(text);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const handleSaveChanges = () => {
    if (!taskTitle.trim() || selectedStatus === undefined) {
      // Se o nome da tarefa estiver vazio, apenas fecha o modal
      setTaskTitle('');
      closeModal();
      setSelectedStatus(undefined);
      return;
    }
  
    // Mapeamento dos nomes das listas com base nos status
    const listNames = {
      todo: "todo",
      inProgress: "inProgress",
      done: "done",
    };
  
    const newStatus = selectedStatus === undefined ? currentTask.statusId : selectedStatus;
    setSelectedStatus(newStatus);
  
    const taskData = { id: currentTask.id, title: taskTitle, statusId: selectedStatus };
    
    //pega o nome da lista atual e a nova lista com base nos status selecionados
    const currentListName = listNames[currentTask.statusId];
    const newListName = listNames[selectedStatus];
  
    //pega as listas atuais e novas
    const currentList = kanbanData[currentListName];
    const newList = kanbanData[newListName];
  
    //atualiza o estado local e o localStorage
    const updatedKanbanData = {
      ...kanbanData,
      [currentListName]: currentList.filter(task => task.id !== currentTask.id),
      [newListName]: [...newList, taskData],
    };
    localStorage.setItem('KanbanData', JSON.stringify(updatedKanbanData));
  
    //salva as alterações
    saveChanges(currentList, newList, currentTask.id, currentListName, newListName, taskData); 
    clearFields();
    closeModal();
  };

    //função para limpar os campos
  const clearFields = () => {
    setTaskTitle('');
    setSelectedStatus(undefined);
  };

  const closeAndUpdate = () => {
    setTaskTitle('');
    setSelectedStatus(undefined);
    closeModal();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.center}>
        <View style={styles.toast}>
          <FontAwesome name="edit" size={24} color="black" style={styles.editIcon} />
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Type title task"
              value={taskTitle}
              onChangeText={handleTitleChange}
            />
          </View>
          <Text style={styles.alert}>*If you want to change only the status, repeat the name and select the new status*</Text>
          <View style={styles.row}>
            <FontAwesome name="exchange" size={24} color="black" style={styles.editIcon} />
            <View style={styles.columnPicker}>
              {statusOptions.map(option => (  //mapeia sobre o array statusOptions
                <TouchableOpacity 
                  key={option.value} 
                  onPress={() => handleStatusChange(option.value)}
                  style={[styles.optionButton, option.value === selectedStatus && styles.selectedOptionButton]} //aplica estilo só qnd atender a condição
                >
                  <Text>{option.status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSaveChanges}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={closeAndUpdate}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alert:{
    color: 'red',
    fontSize: 10,
    marginBottom: 5
  },
  toast: {
    marginTop: '17%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: '80%', 
  },
  center: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  deleteButton: {
    backgroundColor: '#FF6347',
  },
  saveButton: {
    backgroundColor: '#2f4382',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
  },
  input: {
    borderColor: '#a9a9a9',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
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

export default UpdateTask;
