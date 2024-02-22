// Defina o tipo TaskInterface
type TaskInterface = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }
  
  
  export const todoTasks: TaskInterface[] = [
    {
      userId: 1,
      id: 1,
      title: "Task 1 - To Do",
      completed: false
    },
    {
      userId: 1,
      id: 2,
      title: "Task 2 - To Do",
      completed: false
    },
    {
      userId: 1,
      id: 3,
      title: "Task 3 - To Do",
      completed: false
    },
    
  ];
  
  export const doneTasks: TaskInterface[] = [
    {
      userId: 1,
      id: 4,
      title: "Task 4 - Done",
      completed: true
    },
    {
      userId: 1,
      id: 5,
      title: "Task 5 - Done",
      completed: true
    },
    {
      userId: 1,
      id: 6,
      title: "Task 6 - Done",
      completed: true
    },
    
  ];
  
  export const inProgressTasks: TaskInterface[] = [
    {
      userId: 1,
      id: 7,
      title: "Task 7 - In Progress",
      completed: false
    },
    {
      userId: 1,
      id: 8,
      title: "Task 8 - In Progress",
      completed: false
    },
    {
      userId: 1,
      id: 9,
      title: "Task 9 - In Progress",
      completed: false
    },
    
  ];