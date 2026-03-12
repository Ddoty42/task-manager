import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {

  filter: "all"|"active"|"completed" = "all";
  filterOptions: ("all" | "active" | "completed")[] = ["all", "active", "completed"];

  constructor(private taskService: TaskService){}

  get tasks(): Task[]{
    const allTasks = this.taskService.getTasks();      //Set a variable that gets all the tasks via the task service
    switch (this.filter){                              //Filter creates a new array of passing data
      case "active":                                   
        return allTasks.filter((t) => !t.completed)
      case "completed":
        return allTasks.filter((t) => t.completed)
      default:
        return allTasks;
    }
  }
//Getters and Setters

  get activeCount(): number {
    return this.taskService.getTasks().filter((t) => !t.completed).length;   //Gets the total number of uncompleted tasks
  }

  setFilter(filter: "all" | "active" | "completed"): void{   //Simple setter, just like in java, sets the filter options
    this.filter = filter;
  }

toggleTask(id: number): void{
  this.taskService.toggleTask(id);
}

deleteTask(id: number): void{
  this.taskService.deleteTask(id);
}

getPriorityClasses(priority: string): string {
  switch(priority){
    case "high":
      return "bg-red-100 text-red-700 border-red-200";
    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "low":
      return "bg-green-100 text-green-700 border-green-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";

  }
}



}
