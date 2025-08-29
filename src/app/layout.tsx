import type { Metadata } from 'next';
import { Raleway, Montserrat } from 'next/font/google';
import '../styles/globals.css';

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  fallback: ['system-ui', 'arial'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  fallback: ['system-ui', 'arial'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Next.js Starter App',
  description: 'This is a starter app for Next.js to get started faster for projects.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} ${montserrat.variable} bg-background text-foreground antialiased`}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
