export interface Task {
id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  taskType: "work" | "personal" | "other";
  completed: boolean;
  createdAt: Date;
  completedAt?: Date | null;
}
