import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import {
  RenderItemParams,
  ScaleDecorator,
  NestableScrollContainer,
  NestableDraggableFlatList
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AddTask from "./components/AddTask";
import EditTask from "./components/EditTask";
import AsyncStorage from '@react-native-async-storage/async-storage';
import KanbanNavBar from "./components/navbar";
import Header from "./components/Header";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesome } from '@expo/vector-icons'; // Importe o componente de ícone


type KanbanData = {
  todoData: Task[],
  inProgressData: Task[],
  doneData: Task[]
}

type Task = {
  key: string;
  title: string;
  listId: string; 
};

interface AddTaskButtonProps {
  onPress: () => void;
}

export default function App() {
  const [activeList, setActiveList] = useState<string | null>(null);
  const [currentListId, setCurrentListId] = useState('')
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const loadKanbanDataFromStorage = async (): Promise<KanbanData> => {
      const jsonKanbanData = await AsyncStorage.getItem('KanbanData');
      console.log("jsonKanbanData - loading: ", jsonKanbanData)
      return jsonKanbanData ? JSON.parse(jsonKanbanData) : {
        todoData: [],
        inProgressData: [],
        doneData: []
      };
    
  };

  const [activeItemIds, setActiveItemIds] = useState<{ [key: string]: string | null }>({
    todoData: null,
    inProgressData: null,
    doneData: null,
  });
  

  const initialTask = { key: '', title: '', listId: "" }
  const initialKanbanData = {
    todoData: [],
    inProgressData: [],
    doneData: []
  }

  const [kanbanData, setKanbanData] = useState<KanbanData>(initialKanbanData);
  const [currentItem, setCurrentItem] = useState<Task>(initialTask)

  const fetchData = async () => {
    const data = await loadKanbanDataFromStorage();
    setKanbanData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleAddTask = (taskData: Task) => {
    const newTaskData = { ...taskData, key: uuidv4() }; // chave unica
    let formattedData: Task[] = [];
    let newKanbanData: KanbanData = initialKanbanData;
    switch (taskData.listId) {
      case 'todoData':
        formattedData = [newTaskData, ...kanbanData.todoData];
        newKanbanData = { ...kanbanData, todoData: formattedData };
        setKanbanData(newKanbanData);
        break;
      case 'inProgressData':
        formattedData = [newTaskData, ...kanbanData.inProgressData];
        newKanbanData = { ...kanbanData, inProgressData: formattedData };
        setKanbanData(newKanbanData);
        break;
      case 'doneData':
        formattedData = [newTaskData, ...kanbanData.doneData];
        newKanbanData = { ...kanbanData, doneData: formattedData };
        setKanbanData(newKanbanData);
        break;
      default:
        break;
    }
    console.log("kanbandata:", newKanbanData);
    setIsAddModalVisible(false);
    saveLocalStorage(newKanbanData);
  };
  
  
  const editTask = (fromList: Task[], toList: Task[], taskKey: string, fromListName: string, toListName: string, taskData: Task) => {
  
    const taskIndex = fromList.findIndex(task => task.key === taskKey);
    if (taskIndex !== -1) {
      const movedTask = fromList.splice(taskIndex, 1)[0];
      toList = [taskData, ...toList]
  
  
      const newKanbanData = { ...kanbanData, [fromListName]: fromList, [toListName]: toList }
      setKanbanData(newKanbanData)
      saveLocalStorage(newKanbanData) // Salvar os dados atualizados aqui
    }
  };
  
  const handleDragEnd = (data: Task[], listId: string) => {
    console.log('LISTA ID: ',listId)
    const updatedData = data.map((item) => ({
      ...item,
      listId: listId,
    }));
  
    const updatedKanbanData = {
      ...kanbanData,
      [listId]: updatedData,
    };
  
    setKanbanData(updatedKanbanData); // Atualize o estado com os novos dados
    saveLocalStorage(updatedKanbanData); // Salve os dados atualizados no armazenamento local
    setActiveItemIds({ ...activeItemIds, [listId]: null }); // Limpe o estado de item ativo
  
    return updatedKanbanData; // Retorna os dados atualizados
  };
  
  

  const EditTaskButton: React.FC<AddTaskButtonProps> = ({ onPress }) => {
    return (
      <TouchableOpacity>
        <FontAwesome name="edit" size={24} color="black" style={styles.icon} onPress={onPress} />
      </TouchableOpacity>
      
    );
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Task>, listId: string) => {
    const isActiveForColumn = isActive && activeItemIds[listId] === item.key;
  
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={() => {
            drag();
            setActiveItemIds({ ...activeItemIds, [listId]: item.key });
          }}
          disabled={isActiveForColumn}
          style={[
            styles.cardContainer, // Aplicando o estilo do container do card
            isActiveForColumn && styles.activeCardContainer, // Estilo para quando o card estiver ativo
          ]}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <EditTaskButton onPress={() => { setIsEditModalVisible(true); setCurrentItem(item); }} />
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };


  const saveLocalStorage = async (kanbanData: KanbanData) => {
      const jsonKanbanData = JSON.stringify(kanbanData);
      console.log('dados',jsonKanbanData);
      await AsyncStorage.setItem('KanbanData', jsonKanbanData);
  };

  return (
    
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#F0F8FF" }}>

      <NestableScrollContainer style={{ backgroundColor: "#F0F8FF" }}>
        <AddTask
          isVisible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onSave={handleAddTask}
          listId={currentListId}
        />
        <EditTask
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSave={editTask}
          currentItem={currentItem}
          kanbanData={kanbanData}
        />

        <View>
          <KanbanNavBar/>
        </View>

        <View style={{paddingTop: 15}}>
          <Header text={"TO DO"} onPressAdd={() => { setIsAddModalVisible(true); setCurrentListId('todoData'); }} />

          <NestableDraggableFlatList
            style={{ minHeight: 200 }}
            data={kanbanData.todoData}
            renderItem={(params) => renderItem(params, 'todoData')} // Passando 'todoData' como o listId
            keyExtractor={(item) => item.key}
            onDragEnd={({ data }) => {
              setKanbanData(handleDragEnd(data, "todoData"));
              setActiveList(null);
            }}
          />

          <Header text={"IN PROGRESS"} onPressAdd={() => { setIsAddModalVisible(true); setCurrentListId('inProgressData'); }} />
          <NestableDraggableFlatList
            style={{ minHeight: 200 }}
            data={kanbanData.inProgressData}
            renderItem={(params) => renderItem(params, 'inProgressData')} // Passando 'inProgressData' como o listId
            keyExtractor={(item) => item.key}
            onDragEnd={({ data }) => {
              setKanbanData(handleDragEnd(data, "inProgressData"));
              setActiveList(null);
            }}
          />

          <Header text={"DONE"} onPressAdd={() => { setIsAddModalVisible(true); setCurrentListId('doneData'); }} />
          <NestableDraggableFlatList
            style={{ minHeight: 200 }}
            data={kanbanData.doneData}
            renderItem={(params) => renderItem(params, 'doneData')} // Passando 'doneData' como o listId
            keyExtractor={(item) => item.key}
            onDragEnd={({ data }) => {
              setKanbanData(handleDragEnd(data, "doneData"));
              setActiveList(null);
            }}
          />
        </View>
        
      </NestableScrollContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
  },
  cardContainer: {
    backgroundColor: "#8bb6f8",
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    elevation: 5, // Sombra
  },
  activeCardContainer: {
    borderColor: "#2196F3", // borda quando o card está ativo
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18, 
    fontWeight: "bold",
    color: "#333333",
  },
});

