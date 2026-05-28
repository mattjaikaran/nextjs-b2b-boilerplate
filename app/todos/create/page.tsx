import type { Metadata } from 'next';
import { CreateTodoContent } from './create-todo-content';

export const metadata: Metadata = {
  title: 'Create Todo',
  description: 'Add a new task to your todo list',
};

export default function CreateTodoPage() {
  return <CreateTodoContent />;
}
