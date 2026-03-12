import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';
import { DatePipe, TitleCasePipe } from '@angular/common';


@Component({
  selector: 'app-task-form',
  imports: [FormsModule, TitleCasePipe, DatePipe],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  title = "";
  description = "";
  priority: Task["priority"] = "medium";
  isOpen = false;

  constructor(private taskService: TaskService){}

  toggleForm(): void{
    this.isOpen = !this.isOpen;
  }

  onSubmit(): void{
    if (!this.title.trim()) return;

    this.taskService.addTask(
      this.title.trim(),
      this.description.trim(),
      this.priority
    );
    // reset form
    this.title ="";
    this.description="";
    this.priority="medium";
    this.isOpen = false;
  }

priorityOptions: ("low" | "medium" | "high")[] = ["low", "medium", "high"]; 
  
setPriority(priority: "low" | "medium" | "high"): void{   //Simple setter, just like in java, sets the filter options
    this.priority = priority;
  }

  
  
}