import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  allTasks: Task[] = [];
  filter: "all" | "active" | "completed" = "all";
  filterOptions: ("all" | "active" | "completed")[] = ["all", "active", "completed"];
  selectedIds: Set<number> = new Set();
  taskToDelete: Task | null = null;

  priorityOptions: ("low" | "medium" | "high")[] = ["low", "medium", "high"];

  constructor(
    private taskService: TaskService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadTasks();
    this.taskService.tasksChanged.subscribe(() => {
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.allTasks = tasks;
      this.cdr.detectChanges();
    });
  }

  get tasks(): Task[] {
    switch (this.filter) {
      case "active":
        return this.allTasks.filter((t) => !t.completed);
      case "completed":
        return this.allTasks.filter((t) => t.completed);
      default:
        return this.allTasks;
    }
  }

  get activeCount(): number {
    return this.allTasks.filter((t) => !t.completed).length;
  }

  get totalCount(): number{
    return this.allTasks.length;
  }

  setFilter(filter: "all" | "active" | "completed"): void {
    this.filter = filter;
    this.selectedIds.clear();
    this.loadTasks();
  }

  toggleTask(id: number): void {
    const task = this.allTasks.find((t) => t.id === id);
    if (task) {
      this.taskService.toggleTask(id, !task.completed).subscribe(() => {
        this.loadTasks();
      });
    }
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  getPriorityClasses(priority: string): string {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  confirmDelete(task: Task): void {
    this.taskToDelete = task;
  }

  cancelDelete(): void {
    this.taskToDelete = null;
  }

  confirmAndDelete(): void {
    if (this.taskToDelete) {
      const title = this.taskToDelete.title;
      this.taskService.deleteTask(this.taskToDelete.id).subscribe(() => {
        this.taskToDelete = null;
        this.loadTasks();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `"${title}" has been removed`,
          life: 4000
        });
      });
    }
  }

  toggleSelect(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.selectedIds = new Set(this.selectedIds);
  }

  selectAll(): void {
    if (this.allSelected) {
      this.selectedIds.clear();
    } else {
      this.tasks.forEach((t) => this.selectedIds.add(t.id));
    }
    this.selectedIds = new Set(this.selectedIds);
  }

  get allSelected(): boolean {
    return this.tasks.length > 0 && this.tasks.every((t) => this.selectedIds.has(t.id));
  }

  get hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  bulkDelete(): void {
    const count = this.selectedIds.size;
    let completed = 0;
    this.selectedIds.forEach((id) => {
      this.taskService.deleteTask(id).subscribe(() => {
        completed++;
        if (completed === count) {
          this.selectedIds.clear();
          this.selectedIds = new Set(this.selectedIds);
          this.loadTasks();
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: `${count} task${count !== 1 ? 's' : ''} removed`,
            life: 3000
          });
        }
      });
    });
  }

  // Not yet implemented, show/hide toggle for completed tasks
  showCompleted = false;

  toggleShowCompleted(): void {}

  //Edit Task

  taskToEdit: Task | null = null;

  openEdit(task: Task): void {
    this.taskToEdit = {...task};
  }

  cancelEdit(): void{
    this.taskToEdit = null;
  }

  submitEdit(): void{
    if (!this.taskToEdit) return;
    const edited = this.taskToEdit;
    this.taskService.updateTask(
      edited.id,
      edited.title,
      edited.description,
      edited.priority
    ).subscribe(()=> {
      this.messageService.add({
        severity: 'success',
        summary: 'Task Updated',
        detail: `"${edited.title}" has been updated`,
        life: 4000
      });
      this.taskToEdit = null;
      this.cdr.detectChanges();
    });
  }

  bulkComplete(): void{
    const count = this.selectedIds.size;
    const markAs = this.filter === 'completed' ? false : true;
    let completed = 0;
    this.selectedIds.forEach((id) => {
      this.taskService.toggleTask(id, markAs).subscribe(() => {
        completed++;
        if (completed === count){
          this.selectedIds.clear();
          this.selectedIds = new Set(this.selectedIds);
          this.loadTasks();
          this.messageService.add({
            severity: 'success',
            summary: markAs ? 'Tasks Completed' : 'Tasks Reopened',
            detail: `${count} task${count !== 1 ? 's' : ''} marked as ${markAs ? 'complete' : 'incomplete'}`,
            life: 4000
          });
        }
      });
    });
  }

}
