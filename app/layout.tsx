import '@coinbase/onchainkit/styles.css';
import './globals.css';
import Providers from './providers';
import dynamic from 'next/dynamic';
import { metadata } from './metadata';

const ClientToaster = dynamic(
  () => import('./components/ClientToaster').then(mod => mod.ClientToaster),
  { ssr: false }
);

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background dark">
        <Providers>{children}</Providers>
        <ClientToaster />
      </body>
    </html>
  );
}