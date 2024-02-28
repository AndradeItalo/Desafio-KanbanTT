import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import Column from "./column";
import { ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"


const TASKS = gql`
  query getTasks{
    getTasks {
      userId
      id
      title
      completed
    }
  }
`;

type TaskInterface = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  completionDate?: string; // Adiciona a propriedade completionDate
}

export default function KanbanBoard() {
  const { loading, error, data } = useQuery(TASKS);
  //typando os estados todo, done e inprogress
  const [Todo, setTodoTasks] = useState<TaskInterface[]>([]);
  const [Done, setDoneTasks] = useState<TaskInterface[]>([]);
  const [InProgress, setInProgressTasks] = useState<TaskInterface[]>([]);

  const { setTheme} = useTheme();

  useEffect(() => {
    if (data && data.getTasks) {
      const tasksArray = Object.values(data.getTasks).map((task: any) => ({
        userId: parseInt(task.userId),
        id: task.id,
        title: task.title,
        completed: task.completed,
        completionDate: task.completionDate
      }));


  
      // Verificando se o localStorage está vazio
      const savedTodoTasks = localStorage.getItem("todoTasks");
      const savedInProgressTasks = localStorage.getItem("inProgressTasks");
      const savedDoneTasks = localStorage.getItem("doneTasks");
  
      if (!savedTodoTasks) { // Se o localStorage estiver vazio, use tasksArray
        localStorage.setItem("todoTasks", JSON.stringify(tasksArray));
        setTodoTasks(tasksArray);
      } else { // Se houver algo no localStorage, use os valores do localStorage
        setTodoTasks(JSON.parse(savedTodoTasks));
      }
  
      if (!savedInProgressTasks) {
        localStorage.setItem("inProgressTasks", JSON.stringify([]));
        setInProgressTasks([]);
      } else {
        setInProgressTasks(JSON.parse(savedInProgressTasks));
      }
  
      if (!savedDoneTasks) {
        localStorage.setItem("doneTasks", JSON.stringify([]));
        setDoneTasks([]);
      } else {
        setDoneTasks(JSON.parse(savedDoneTasks));
      }
    }
  }, [data]);
  

  //função q é ativada quando o usuário arrasta o item
  const handleDragEnd = (result: DropResult) => {

    const { destination, source, draggableId } = result;
    //console.log('draggableId:', draggableId);
    //console.log('Tipo de draggableId:', typeof draggableId);

    if (!destination) { //se for arrastada p um lugar que não existe, retorna a função sem fazer nada
      return;
    }
  
    const sourceColumn = getColumnData(source.droppableId); //pegando a coluna de origem da task arrastada
    const destinationColumn = getColumnData(destination.droppableId); //coluna de destino da task arrastada
    const draggedTask = sourceColumn.find(
      (task: TaskInterface) => task.id.toString() === draggableId
    );
    
    
    if (!draggedTask) { //caso seja uma tarefa inexistente
      return;
    }
  
    
    if (destination.droppableId === source.droppableId) { // Se a tarefa estiver sendo movida dentro da mesma coluna
      const updatedColumn = Array.from(sourceColumn);
      updatedColumn.splice(source.index, 1); // Remove da posição atual
      updatedColumn.splice(destination.index, 0, draggedTask); // Insere na nova posição
      
      // Atualiza o estado da coluna correspondente & localstorage
      switch (destination.droppableId) {
        case "todo":
          setTodoTasks(updatedColumn);
          updateLocalStorage("todoTasks", updatedColumn);
          break;
        case "inProgress":
          setInProgressTasks(updatedColumn);
          updateLocalStorage("inProgressTasks", updatedColumn);
          break;
        case "done":
          setDoneTasks(updatedColumn);
          updateLocalStorage("doneTasks", updatedColumn);
          break;
        default:
          break;
      }
    } else { 
      // Se a tarefa estiver sendo movida para uma coluna diferente
      const updatedSourceColumn = [...sourceColumn];
      updatedSourceColumn.splice(source.index, 1); // Remove da posição atual
  
      let updatedDestinationColumn = [...destinationColumn];
      updatedDestinationColumn.splice(destination.index, 0, draggedTask); // Insere na nova posição
  

      //console.log(destination.droppableId)
      if (destination.droppableId === 'done') { // Se a tarefa estiver sendo movida para a coluna Done
        const completionDate = new Date().toISOString();
        const updatedTask = { ...draggedTask, completed: true, completionDate }; // Marcar como concluída
      
        // Atualiza a tarefa na coluna "done"
        const updatedColumn = updatedDestinationColumn.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );

        // Define o estado e atualiza o armazenamento local
        setDoneTasks(updatedColumn);
        updateLocalStorage('doneTasks', updatedColumn);
        updatedDestinationColumn = updatedColumn;

      }
      else if (source.droppableId === 'done') {

        const updatedTask = { ...draggedTask, completed: false };

        const updatedColumn = updatedDestinationColumn.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        );

        updatedDestinationColumn = updatedColumn;
        setDoneTasks(getColumnData('done').map(task =>
          task.id === updatedTask.id ? updatedTask : task
        ));
      
        updateLocalStorage('doneTasks', getColumnData('done').map(task =>
          task.id === updatedTask.id ? updatedTask : task
        ));
      }

      console.log('aqui',updatedDestinationColumn)
      // Atualiza os estados das colunas & localstorage
      switch (source.droppableId) {
        case "todo":       
          setTodoTasks(updatedSourceColumn);
          updateLocalStorage("todoTasks", updatedSourceColumn);
          break;
        case "inProgress":
          setInProgressTasks(updatedSourceColumn);
          updateLocalStorage("inProgressTasks", updatedSourceColumn);
          break;
        case "done":
          setDoneTasks(updatedSourceColumn);
          updateLocalStorage("doneTasks", updatedSourceColumn);
          break;
        default:
          break;
      }
      

      switch (destination.droppableId) {
        case "todo":
          setTodoTasks(updatedDestinationColumn);
          updateLocalStorage("todoTasks", updatedDestinationColumn);
          break;
        case "inProgress":
          setInProgressTasks(updatedDestinationColumn);
          updateLocalStorage("inProgressTasks", updatedDestinationColumn);
          break;
        case "done":
          setDoneTasks(updatedDestinationColumn);
          updateLocalStorage("doneTasks", updatedDestinationColumn);
          //console.log('entrou',localStorage.getItem('doneTasks'))
          break;
        default:
          break;
      }
    }
  };


  // Função auxiliar para atualizar o localStorage
  const updateLocalStorage = (key: string, data: TaskInterface[]) => {
    localStorage.setItem(key, JSON.stringify(data));
    console.log('oi', localStorage.getItem('doneTasks'));
  };
  
  
  //pegando toda a coluna com base no ID (todo, inProgress, done)
  const getColumnData = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return Todo;
      case "inProgress":
        return InProgress;
      case "done":
        return Done;
      default:
        return [];
    }
  };

  const countTasks = (tasks: TaskInterface[]) => {
    return tasks.length;
  };

  
  return (
    
    <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-row justify-center gap-8 row-auto w-[1300px] container mt-20 mb-8">
          <Column title="TO DO" tasks={Todo} id="todo"> 
            <span className="text-lg text-gray-500"> | {countTasks(Todo)}</span>
          </Column>

          <Column title="IN PROGRESS" tasks={InProgress} id="inProgress"> 
            <span className="text-lg text-gray-500"> | {countTasks(InProgress)}</span> 
          </Column>

          <Column title="DONE" tasks={Done} id="done"> 
            <span className="text-lg text-gray-500"> | {countTasks(Done)}</span> 
          </Column>
        </div>
      
    </DragDropContext>
  );
}
