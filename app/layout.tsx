import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Women in AI Research Podcast",
  description:
    "Celebrating the remarkable contributions of female AI researchers from around the globe",
  openGraph: {
    title: "Women in AI Research Podcast",
    description: "Celebrating the remarkable contributions of female AI researchers from around the globe",
    url: "https://women-in-ai-research.github.io/",
    siteName: "Women in AI Research",
    images: [
      {
        url: "https://women-in-ai-research.github.io/images/logo.png",
        width: 2400,
        height: 1260,
        alt: "Women in AI Research Podcast Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Women in AI Research Podcast",
    description: "Celebrating the remarkable contributions of female AI researchers from around the globe",
    images: ["https://women-in-ai-research.github.io/images/logo.png"],
    creator: "@WiAIR_podcast",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-08ZF8WR7XN"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-08ZF8WR7XN');
          `
        }}>
        </script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/js/conflict-detection.min.js" integrity="sha512-K5+wFlOsuophh3a/Im5Xc/i3w5YnOJmfTS74GUNHUH0UPe2Y55Y8iLkFkLjYy6aJy999ZIoKjsmFJMhjq3MlHQ==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
