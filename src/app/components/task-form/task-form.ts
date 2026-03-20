import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';
import { TitleCasePipe } from '@angular/common';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-task-form',
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  title = "";
  description = "";
  @ViewChild('titleInput') titleInput!: ElementRef;
  priority: Task["priority"] = "medium";
  isOpen = false;
  existingTasks: Task[] = [];

  constructor(private taskService: TaskService, private messageService: MessageService, private cdr: ChangeDetectorRef){}

  toggleForm(): void {
  this.isOpen = !this.isOpen;
  if (this.isOpen) {
    this.taskService.getTasks().subscribe((tasks)=> {
      this.existingTasks = tasks;
      this.cdr.detectChanges();
    });
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
    }, 0);
  }else {
    this.title = "";
    this.description = "";
    this.priority = "medium";
  }
}

  onSubmit(): void{
    if (!this.title.trim()) return;

    const taskTitle = this.title.trim();

    if (this.isDuplicate()){
      this.messageService.add({
        severity: 'error',
        summary: 'Duplicate Task',
        detail: `"${this.title.trim()}" already exists`,
        life: 4000
      });
      return;
    }

    this.taskService.addTask(
      taskTitle,
      this.description.trim(),
      this.priority
    ).subscribe(() => {
      this.messageService.add({
      severity: 'success',
      summary: 'Task Added',
      detail: `"${taskTitle}" has been created`,
      life: 3000
    });
    this.cdr.detectChanges();
    });


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

  hasSpecialCharacters(text: string): boolean{
    const pattern = /[^a-zA-Z0-9\-]/;
    return pattern.test(text)
  }

 onTitleKeydown(event: KeyboardEvent): void {
  const allowed = /[a-zA-Z0-9\s'\-\/]/;
  const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];

  if (controlKeys.includes(event.key)) return;

  if (!allowed.test(event.key)) {
    event.preventDefault();
  }
}

isDuplicate(): boolean {
  return this.existingTasks.some(
    (t) => t.title.toLowerCase() === this.title.trim().toLowerCase());
}
}
