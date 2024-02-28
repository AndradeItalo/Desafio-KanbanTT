import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BsPencilSquare } from 'react-icons/bs'; // Importar o ícone de lápis
import { Button } from "./ui/button";

type TaskInterface = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
  completionDate?: string;
}

// Defina diferentes estilos de fundo com base no ID da coluna
type ColumnBackgroundStyles = {
  [key: string]: string;
}

export default function Column({ title, tasks, id, children, updateTaskTitle }: { title: string, tasks: TaskInterface[], id: string, children: React.ReactNode, updateTaskTitle: (taskId: number, newTitle: string) => void }) {
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  

  // Função para iniciar a edição do título da tarefa
  const startEditingTask = (taskId: number, currentTitle: string) => {
    setEditingTaskId(taskId);
    setNewTaskTitle(currentTitle);
  };

// Função para salvar o novo título da tarefa
const saveEditedTask = (taskId: number) => {
  // Atualiza as tarefas com o novo título editado
  const updatedTasks = tasks.map(task =>
    task.id === taskId ? { ...task, title: newTaskTitle } : task
  );

  // Atualiza o localStorage
  if (title === 'TO DO') {
    localStorage.setItem('todoTasks', JSON.stringify(updatedTasks));
  } else if (title === 'IN PROGRESS') {
    localStorage.setItem('inProgressTasks', JSON.stringify(updatedTasks));
  } else if (title === 'DONE') {
    localStorage.setItem('doneTasks', JSON.stringify(updatedTasks));
  }
  
  updateTaskTitle(taskId, newTaskTitle);
  setEditingTaskId(null);
  setNewTaskTitle("");
};


  // Define diferentes estilos de fundo com base no ID da coluna
  const columnBackgroundStyles: ColumnBackgroundStyles = {
    todo: "bg-blue-200",
    inProgress: "bg-yellow-200",
    done: "bg-green-200"
  };

  // Obtém o estilo de fundo com base no ID da coluna
  const columnBackgroundStyle = columnBackgroundStyles[id];

  // Função para formatar a data de conclusão
  const formatDate = (completionDate?: string) => {
    if (!completionDate) return ""; // Retorna uma string vazia se a data de conclusão não estiver disponível
    const date = new Date(completionDate);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }); // Formata a data no formato "dia de mês de ano"
  };

  return (
    <Droppable droppableId={id} type="TASK" >
      {(provided, snapshot) => (
        <Card 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(`w-[300px] h-fit min-h-40 bg-slate-200`, {'bg-slate-400': snapshot.isDraggingOver})}
        >
          <CardHeader className={columnBackgroundStyle}>
            <CardTitle>{title}{children}</CardTitle>
          </CardHeader>
          <Separator/>
          <CardContent className="mt-3">
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`mb-2`}
                  >
                    <Card className={cn(`border border-gray-300 p-2 relative`, {'bg-gray-300': snapshot.isDropAnimating})}>
                      <CardContent>
                        {editingTaskId === task.id ? (
                          <div className="flex items-center justify-between"> 
                            <input 
                              type="text" 
                              value={newTaskTitle} 
                              onChange={(e) => setNewTaskTitle(e.target.value)} 
                            />
                            <div>
                              <Button onClick={() => saveEditedTask(task.id)}>Save</Button> 
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between"> 
                            <p>{task.title}</p>
                            <BsPencilSquare 
                              onClick={() => startEditingTask(task.id, task.title)} 
                              className="cursor-pointer text-xl text-gray-500" 
                            />
                          </div>
                        )}
                        {task.completed && (
                          <p className= "text-sm text-slate-400">
                            Concluída {formatDate(task.completionDate)}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </CardContent>
        </Card>
      )}
    </Droppable>
  );
}
