import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./task";

type TaskInterface = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }


export default function Column({ title, tasks , id }: {title: string, tasks: TaskInterface[] , id: string}) {
    return (
            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div style={{
                        padding: '3px',
                        transition: 'background-color 0.2s ease',
                        backgroundColor: '#f4f5f7',
                        flexGrow: 1,
                        minHeight: '100px'
                    }}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <h1>title</h1>
                    {tasks.map((task, index) => (
                        <Task key={index} index={index} task={task} />
                    ))}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
    );
}