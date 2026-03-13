import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskForm } from './components/task-form/task-form';
import { TaskList } from './components/task-list/task-list';
import { ToastModule } from 'primeng/toast';
import {Toast} from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [TaskForm,TaskList, ToastModule],
  providers:[MessageService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('task-manager');
}
