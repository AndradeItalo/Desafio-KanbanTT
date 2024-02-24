import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TaskInterface = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// Defina um tipo explícito para columnBackgroundStyles
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

  return (
    <Droppable droppableId={id} type="TASK">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`w-[300px] p-2 rounded-lg ${columnBackgroundStyles[id]}`}
        >
          <CardHeader>
            <CardTitle>{title}{children}</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`mb-2 ${snapshot.isDragging ? 'bg-gray-100' : ''}`}
                  >
                    <Card className={`border border-gray-300 p-2 ${snapshot.isDragging ? 'bg-gray-100' : ''}`}>
                      <CardContent>
                        <p>{task.title}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </CardContent>
        </div>
      )}
    </Droppable>
  );
}
