import { Injectable } from '@angular/core';
import { Task } from "../models/task";

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: 1,
      title: "Learn Angular Basics",
      description: "Complete the official Angular Tutorial",
      priority: "high",
      completed: false,
      createdAt: new Date("03-10-2026")
    },
    {
      id: 2,
      title: "Become Senior Level",
      description: "Grind until you rise through the ranks",
      priority: "low",
      completed: false,
      createdAt: new Date("03-10-2026")
    },
    {
      id: 3,
      title: "Get a friend for Milo",
      description: "After buying a car, get a friend for Milo. He's lonely.",
      priority: "medium",
      completed: false,
      createdAt: new Date("03-10-2026")
    },
    {
      id: 4,
      title: "Buy a new car",
      description: "After buying a car, get a friend for Milo. He's lonely.",
      priority: "high",
      completed: false,
      createdAt: new Date("03-10-2026")
    },
    {
      id: 5,
      title: "Buy a new PC",
      description: "Get a new PC, it's time",
      priority: "high",
      completed: true,
      createdAt: new Date("03-10-2026")
    },
  ]
  private nextId = 6;

//READ get all tasks
  getTasks(): Task[]{
    return this.tasks;
  }

//WRITE
addTask(title: string, description: string, priority: Task["priority"]): void {
  this.tasks.push({
    id: this.nextId++,
    title,
    description,
    priority,
    completed: false,
    createdAt: new Date()
  });
}

//UPDATE - Completed Toggle
  toggleTask(id: number): void {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }

//DELETE 
deleteTask(id: number): void {
this.tasks = this.tasks.filter((t) => t.id !== id);

}


}









 
