import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { todoTasks, doneTasks, inProgressTasks } from '../app/mocked-data';
import Column from "./column";
import { Button } from "@/components/ui/button"



type TaskInterface = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export default function KanbanBoard() {
  //typando os estados todo, done e inprogress
  const [Todo, setTodoTasks] = useState<TaskInterface[]>([]);
  const [Done, setDoneTasks] = useState<TaskInterface[]>([]);
  const [InProgress, setInProgressTasks] = useState<TaskInterface[]>([]);

  useEffect(() => {
    //vendo se há algo no localstorage (se as tasks já foram modificadas "todo, done, inprogress")
    const savedTodoTasks = localStorage.getItem("todoTasks");
    const savedInprogressTasks = localStorage.getItem("inProgressTasks");
    const savedDoneTasks = localStorage.getItem("doneTasks");
    
    if(savedTodoTasks){ //se já há tarefas ToDo no localstorage, renderizo a página com essas informações.
      setTodoTasks(JSON.parse(savedTodoTasks));
    } else { //se n tiver, incializo com os dados mockados
      localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
      setTodoTasks(todoTasks);
    }

    if(savedInprogressTasks){  //se já há tarefas InProgress no localstorage, renderizo a página com essas informações.
      setInProgressTasks(JSON.parse(savedInprogressTasks));
    } else {
      localStorage.setItem("inProgressTasks", JSON.stringify(inProgressTasks));
      setInProgressTasks(inProgressTasks);
    }

    if(savedDoneTasks){ //se já há tarefas Done no localstorage, renderizo a página com essas informações.
      setDoneTasks(JSON.parse(savedDoneTasks));
    } else {
      localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
      setDoneTasks(doneTasks)
    }
  }, []);
  
  //função q é ativada quando o usuário arrasta o item
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
  
    if (!destination) { //se for arrastada p um lugar que não existe, retorna a função sem fazer nada
      return;
    }
  
    const sourceColumn = getColumnData(source.droppableId); //pegando a coluna de origem da task arrastada
    const destinationColumn = getColumnData(destination.droppableId); //coluna de destino da task arrastada
    const draggedTask = sourceColumn.find(
      (task: TaskInterface) => task.id === parseInt(draggableId)
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
  
      const updatedDestinationColumn = [...destinationColumn];
      updatedDestinationColumn.splice(destination.index, 0, draggedTask); // Insere na nova posição
  
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
          break;
        default:
          break;
      }
    }
  };

  // Função auxiliar para atualizar o localStorage
  const updateLocalStorage = (key: string, data: TaskInterface[]) => {
    localStorage.setItem(key, JSON.stringify(data));
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
      <h1 className="text-center p-4 text-3xl font-bold text-gray-800 shadow-md">Progress Board</h1>

      <div className="fixed top-4 right-4">
        <Button>DashBoard</Button>
      </div>

      <div className="flex justify-center gap-8 row-auto w-[1300px] container mt-20">
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
