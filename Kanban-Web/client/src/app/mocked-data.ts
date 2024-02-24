// Defina o tipo TaskInterface
type TaskInterface = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }
  
  
  export const todoTasks: TaskInterface[] = [
    {
      userId: 0,
      id: 0,
      title: "Task 1 - To Do",
      completed: false
    },
    {
      userId: 0,
      id: 1,
      title: "Task 2 - To Do",
      completed: false
    },
    {
      userId: 0,
      id: 2,
      title: "Task 3 - To Do",
      completed: false
    },
    
  ];
  
  export const doneTasks: TaskInterface[] = [
    {
      userId: 0,
      id: 3,
      title: "Task 7 - Done",
      completed: true
    },
    {
      userId: 0,
      id: 4,
      title: "Task 8 - Done",
      completed: true
    },
    {
      userId: 0,
      id: 5,
      title: "Task 9 - Done",
      completed: true
    },
    
  ];
  
  export const inProgressTasks: TaskInterface[] = [
    {
      userId: 0,
      id: 6,
      title: "Task 4 - In Progress",
      completed: false
    },
    {
      userId: 0,
      id: 7,
      title: "Task 5 - In Progress",
      completed: false
    },
    {
      userId: 0,
      id: 8,
      title: "Task 6 - In Progress",
      completed: false
    },
    
  ];