export type StaffTask = {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  createdAt: any;
};