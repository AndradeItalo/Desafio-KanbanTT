import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";


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

export default function Column({ title, tasks, id, children}: { title: string, tasks: TaskInterface[], id: string, children: React.ReactNode }) {
  // Define diferentes estilos de fundo com base no ID da coluna
  const columnBackgroundStyles: ColumnBackgroundStyles = {
    todo: "bg-blue-200",
    inProgress: "bg-yellow-200",
    done: "bg-green-200"
  };

  // Obtém o estilo de fundo com base no ID da coluna
  const columnBackgroundStyle = columnBackgroundStyles[id];

  return (
    <Droppable droppableId={id} type="TASK" >
      {(provided, snapshot) => (
        <Card 
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(`w-[300px] h-fit min-h-40`, {'bg-slate-400': snapshot.isDraggingOver})}
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
                    <Card className={cn(`border border-gray-300 p-2`, {'bg-gray-300': snapshot.isDropAnimating})}>
                      <CardContent>
                        <p>{task.title}</p>
                        {task.completed && <p>Concluída</p>}
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
