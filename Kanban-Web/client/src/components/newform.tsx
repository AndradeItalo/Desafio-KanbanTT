import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type StatusTask = "todo" | "inprogress" | "done";

interface TaskFormProps {
  onSubmit: (newTaskTitle: string, status: StatusTask, creationDate: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [status, setStatus] = useState<StatusTask>("todo"); // Estado para controlar o status selecionado

  const handleNewTaskChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTaskTitle(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value as StatusTask); // Atualiza o status selecionado
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return; // Não permite tarefas em branco
    const creationDate = new Date().toISOString(); // Obtém a data atual
    onSubmit(newTaskTitle, status, creationDate); // Envia o título da tarefa, o status selecionado e a data de criação
    // Limpa o campo do formulário
    setNewTaskTitle("");
    // Reseta o status para "todo" após o envio do formulário
    setStatus("todo");
  };

  const handleCreateClick = () => {
    if (!newTaskTitle.trim()) return; // Não permite tarefas em branco
    const creationDate = new Date().toISOString(); // Obtém a data atual
    onSubmit(newTaskTitle, status, creationDate); // Envia o título da tarefa, o status e a data de criação
    // Limpa o campo do formulário
    setNewTaskTitle("");
    // Reseta o status para "todo" após o envio do formulário
    setStatus("todo");
    // Fecha o popover após o envio do formulário
  };

  return (
    <Card className="w-[315px]">
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
        <CardDescription>Deploy your new task</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="Form">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="taskTitle"
                value={newTaskTitle}
                onChange={handleNewTaskChange}
                placeholder="Title of your task"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Input
                type="text"
                id="taskStatus"
                value={status}
                onChange={handleStatusChange}
                placeholder="Enter status: todo, inprogress, done"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleCreateClick}>Create</Button>
      </CardFooter>
    </Card>
  );
};

export default TaskForm;
