import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Task from "./task";
import dynamic from "next/dynamic";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type TaskInterface = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }

  

export default function Column({ title, tasks , id }: {title: string, tasks: TaskInterface[] , id: string}) {
    return (
        <Card className="w-[300px]">
            <CardHeader>
                <CardTitle className="">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Droppable droppableId={id}>
                    {(provided, snapshot) => (
                        <Card
                            ref={provided.innerRef}
                            className="p-3 transition-colors bg-gray-200 min-h-100"
                            {...provided.droppableProps}
                        >
                            {tasks.map((task, index) => (
                                <Draggable draggableId={`${task.id}`} key={task.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <p>{task.title}</p>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Card>
                    )}
                </Droppable>
            </CardContent>
        </Card>
    );
}
