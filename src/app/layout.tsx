import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/leaflet.css';

export const metadata: Metadata = {
  title: 'Boa Saúde - Cuidando da sua saúde',
  description: 'Aplicativo de saúde digital',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
