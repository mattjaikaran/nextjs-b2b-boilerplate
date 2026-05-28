import type { Metadata } from 'next';
import { FAQContent } from './faq-content';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about our service',
};

export default function FAQPage() {
  return <FAQContent />;
}
