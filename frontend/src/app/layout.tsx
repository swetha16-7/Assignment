import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProposalCraft | Dynamic Proposal Generation System',
  description: 'Create, preview, and download executive-grade business proposals with multi-template PDF generation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-[#fafbfd] text-navy-900 selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
