import {  Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';
import { TitleCasePipe } from '@angular/common';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  taskForm: FormGroup;
  taskTypeOptions: ("work" | "personal" | "other")[] = ["work", "personal", "other"]
  isOpen = false;
  existingTasks: Task[] = [];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ){
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['medium'],
      taskType: ['other']
    });
  }

  toggleForm(): void {
  this.isOpen = !this.isOpen;
  if (this.isOpen) {
    this.taskService.getTasks().subscribe((tasks)=> {
      this.existingTasks = tasks;
      this.cdr.detectChanges();
    });
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('[formControlName="title"]')
      input?.focus();
    }, 0);
  }else {
    this.taskForm.reset({priority: 'medium', taskType: 'other'});
  }
}

  onSubmit(): void{
    if (this.taskForm.invalid) return;

  const {title, description, priority, taskType} = this.taskForm.value;
  const taskTitle = title.trim();

    if (this.isDuplicate()){
      this.messageService.add({
        severity: 'error',
        summary: 'Duplicate Task',
        detail: `"${taskTitle}" already exists`,
        life: 4000
      });
      return;
    }

    this.taskService.addTask(
      taskTitle,
      description.trim(),
      priority,
      taskType
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
    this.taskForm.reset({priority: 'medium', taskType: 'other'});
    this.isOpen = false;
  }

priorityOptions: ("low" | "medium" | "high")[] = ["low", "medium", "high"];

setPriority(priority: "low" | "medium" | "high"): void{   //Simple setter, just like in java, sets the filter options
    this.taskForm.get('priority')?.setValue(priority);
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
    const title = this.taskForm.get('title')?.value?.trim().toLowerCase();
    return this.existingTasks.some(t => t.title.toLowerCase() === title);
  }
}
