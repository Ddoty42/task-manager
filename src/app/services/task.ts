import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';
  tasksChanged = new Subject<void>();

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(title: string, description: string, priority: Task['priority']): Observable<Task> {
  const task = {
    title,
    description,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  return this.http.post<Task>(this.apiUrl, task).pipe(
    tap(() => this.tasksChanged.next())
  );
}

toggleTask(id: number, completed: boolean): Observable<Task> {
  return this.http.patch<Task>(`${this.apiUrl}/${id}`, { completed }).pipe(
    tap(() => this.tasksChanged.next())
  );
}

deleteTask(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    tap(() => this.tasksChanged.next())
  );
}

updateTask(id: number, title: string, description: string, priority: Task['priority']): Observable<Task>{
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, {title, description, priority}).pipe(tap(() => this.tasksChanged.next())
    );
}

}
