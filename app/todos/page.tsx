import type { Metadata } from 'next';
import { TodosContent } from './todos-content';

export const metadata: Metadata = {
  title: 'Todos',
  description: 'Manage your tasks and stay organized',
};

export default function TodosPage() {
  return <TodosContent />;
}
