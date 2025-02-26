import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Women in AI Research Podcast',
    description: 'Celebrating the remarkable contributions of female AI researchers from around the globe',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" data-oid=":1ey.w-">
            <body className={inter.className} data-oid="ng:dce:">
                {children}
            </body>
        </html>
    );
}
