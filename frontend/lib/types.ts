export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type Point = { x: number; y: number };

export type Polygon = {
  id: number;
  image: number;
  label: string;
  color: string;
  points: Point[];
  created_at: string;
};

export type AnnotatedImage = {
  id: number;
  title: string;
  image: string;
  image_url: string;
  polygons: Polygon[];
  created_at: string;
};
