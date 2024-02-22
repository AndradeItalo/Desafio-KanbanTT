import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { todoTasks, doneTasks, inProgressTasks } from '../app/mocked-data';
import Column from "./column";

type TaskInterface = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}


export default function KanbanBoard() {

  const handleDragEnd = (result: any) => {
    console.log(result);
};

  return(
    <DragDropContext onDragEnd={handleDragEnd}>
            <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    width: "1300px",
                    margin: "0 auto"
                }}
            >
                <Column title={"TO DO"} tasks={todoTasks} id={"1"} />
                <Column title={"DONE"} tasks={doneTasks} id={"2"} />
                <Column title={"IN PROGESS"} tasks={inProgressTasks} id={"3"} />
            </div>
        </DragDropContext>
  )
}
