import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import Navbar from './components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Uptime Monitor',
  description: 'Monitor your endpoints with ease',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors duration-200`}>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    © 2024 Uptime Monitor. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
