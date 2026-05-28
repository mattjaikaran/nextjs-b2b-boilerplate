import type { Metadata } from 'next';
import { FeedbackContent } from './feedback-content';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Share your feedback and help us improve',
};

export default function FeedbackPage() {
  return <FeedbackContent />;
}
