export interface Task {
id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: Date;
}
