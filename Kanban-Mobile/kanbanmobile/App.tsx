import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity} from "react-native";
import { RenderItemParams, ScaleDecorator, NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import KanbanNavBar from "./components/navbar";
import Header from "./components/Header";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesome } from '@expo/vector-icons'; // Importe o componente de ícone
import UpdateTask from "./components/updateDelete";
import CreateTask from "./components/create";


type KanbanData = {
  todo: Task[],
  inProgress: Task[],
  done: Task[]
}

type Task = {
  id: string;
  title: string;
  statusId: string; 
};

interface ButtonProps {
  onPress: () => void;
}

export default function App() {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [currentstatusId, setCurrentstatusId] = useState('')
  const [isCreateTask, setIsCreateTask] = useState(false); //toast de criar task
  const [isEditToast, setIsEditToast] = useState(false); //toast de editar

  //carregar os dados do kanban do armazenamento local
  const loadKanban = async (): Promise<KanbanData> => { 
    const storedKanbanData = await AsyncStorage.getItem('KanbanData');
    return storedKanbanData ? JSON.parse(storedKanbanData) : {
      todo: [],
      inProgress: [],
      done: []
    };
  };

  const [activeItemIds, setActiveItemIds] = useState<{ [id: string]: string | null }>({
    todo: null,
    inProgress: null,
    done: null,
  });

  const firstTask = { id: '', title: '', statusId: "" }
  const firstKanbanData = {
    todo: [],
    inProgress: [],
    done: []
  }

  const [kanbanData, setKanbanData] = useState<KanbanData>(firstKanbanData);
  const [currentItem, setCurrentItem] = useState<Task>(firstTask)

  const loadData = async () => {
    const data = await loadKanban();
    setKanbanData(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  
  const handleCreate = (taskData: Task) => {
    const newTaskData = { ...taskData, id: uuidv4() }; // gera o id unico para cada task
    const { statusId } = taskData; // pega qual a coluna que irá ser adicionada a nova task
  
    // Cria uma cópia do estado atual do kanban
    const updatedKanbanData: KanbanData = {
      todo: [...kanbanData.todo],
      inProgress: [...kanbanData.inProgress],
      done: [...kanbanData.done]
    };
  
    // adiciona a nova tarefa à lista apropriada com base no statusId
    switch (statusId) {
      case 'todo':
        updatedKanbanData.todo.unshift(newTaskData); 
        break;
      case 'inProgress':
        updatedKanbanData.inProgress.unshift(newTaskData); 
        break;
      case 'done':
        updatedKanbanData.done.unshift(newTaskData); 
        break;
      default:
        break;
    }
  
    setKanbanData(updatedKanbanData);//atualiza o estado com os novos dados do kanban
    setIsCreateTask(false);    //fecha o toast de criação de tarefa
    saveKanbanData(updatedKanbanData);//salva os dados do kanban no armazenamento local
  };
  
  
  
  const editTask = (sourceList: Task[], destinationList: Task[], taskId: string, sourceListName: string, destinationListName: string, taskData: Task) => {
    const taskIndex = sourceList.findIndex(task => task.id === taskId); //encontra o índice da tarefa na lista de origem
  
    if (taskIndex !== -1) {//verifica se a tarefa foi encontrada na lista de origem
      const movedTask = sourceList.splice(taskIndex, 1)[0];
      
      //adiciona a tarefa atualizada à lista de destino
      destinationList.unshift(taskData);
  
      //atualiza o kanban com as listas editadas
      const updatedKanbanData: KanbanData = {
        ...kanbanData,
        [sourceListName]: [...sourceList],
        [destinationListName]: [...destinationList]
      };
      
      //atualiza o estado do kanban
      setKanbanData(updatedKanbanData);
      
      //salva os dados atualizados no armazenamento local
      saveKanbanData(updatedKanbanData);
    }
  };
  
  const handleDragEnd = (data: Task[], statusId: string) => {
    const updatedData = data.map(item => ({ ...item, statusId }));//mapeia os dados atualizados com o novo statusId
  
    // Atualiza o kanbanData apenas com o statusId atualizado
    const updatedKanbanData = { ...kanbanData, [statusId]: updatedData };
  
    setKanbanData(updatedKanbanData);                          //atualiza o estado com os novos dados
    saveKanbanData(updatedKanbanData);                        //salva os dados atualizados no armazenamento local
    setActiveItemIds({ ...activeItemIds, [statusId]: null });//limpa o estado de item ativo
  
    // Retorna os dados atualizados
    return updatedKanbanData;
  };
  
  const UpdateTaskButton: React.FC<ButtonProps> = ({ onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <FontAwesome name="edit" size={24} color="black" style={styles.icon} />
      </TouchableOpacity>
    );
  };
  

  const renderTask = ({ item, drag, isActive }: RenderItemParams<Task>, statusId: string) => {
    const isActiveForColumn = isActive && activeItemIds[statusId] === item.id;
  
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={() => {
            drag();
            setActiveItemIds({ ...activeItemIds, [statusId]: item.id });
          }}
          disabled={isActiveForColumn}
          style={[
            styles.cardContainer, // Aplicando o estilo do container do card
            isActiveForColumn && styles.activeCardContainer, // Estilo para quando o card estiver ativo
          ]}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <UpdateTaskButton onPress={() => { setIsEditToast(true); setCurrentItem(item); }} />
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };


  const saveKanbanData = async (kanbanData: KanbanData) => {
      const jsonKanbanData = JSON.stringify(kanbanData);
      await AsyncStorage.setItem('KanbanData', jsonKanbanData);
  };

  return (
    
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#F0F8FF" }}>

      <NestableScrollContainer>
        <CreateTask
          isVisible={isCreateTask}
          closeModal={() => setIsCreateTask(false)}
          saveChanges={handleCreate}
          statusId={currentstatusId}
        />
        <UpdateTask
          isVisible={isEditToast}
          closeModal={() => setIsEditToast(false)}
          saveChanges={editTask}
          currentTask={currentItem}
          kanbanData={kanbanData}
          
        />

        <View>
          <KanbanNavBar/>
        </View>

        <View style={{paddingTop: 15}}>
          <Header text={"TO DO"} onPressAdd={() => { setIsCreateTask(true); setCurrentstatusId('todo'); }} />
          <NestableDraggableFlatList
            style={{ minHeight: 200 }}
            data={kanbanData.todo}
            renderItem={(params) => renderTask(params, 'todo')} 
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => {
              setKanbanData(handleDragEnd(data, "todo"));
              setActiveItemId(null);
            }}
          />

          <Header text={"IN PROGRESS"} onPressAdd={() => { setIsCreateTask(true); setCurrentstatusId('inProgress'); }} />
          <NestableDraggableFlatList
            style={{ minHeight: 200 }}
            data={kanbanData.inProgress}
            renderItem={(params) => renderTask(params, 'inProgress')} 
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => {
              setKanbanData(handleDragEnd(data, "inProgress"));
              setActiveItemId(null);
            }}
          />

          <Header text={"DONE"} onPressAdd={() => { setIsCreateTask(true); setCurrentstatusId('done'); }} />
          <NestableDraggableFlatList
            style={{ minHeight: 200 }}
            data={kanbanData.done}
            renderItem={(params) => renderTask(params, 'done')} 
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => {
              setKanbanData(handleDragEnd(data, "done"));
              setActiveItemId(null);
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
    elevation: 5
  },
  activeCardContainer: {
    borderColor: "#2196F3", //cor da borda quando o card está ativo
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
