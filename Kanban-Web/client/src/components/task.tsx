import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { BsPencilSquare } from 'react-icons/bs';

type TaskInterface = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }

export default function Task({ task, index }: { task: TaskInterface, index: number }) {
    console.log("Task ID:", task.id)
    
    return (
        
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
    
)};
