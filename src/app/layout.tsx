import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "AboutMe.dev",
  description: "Learn all about my development skills and projects.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} min-h-screen bg-[#0C1116]`}>
        <TRPCReactProvider>
          <header className="flex items-center justify-between p-4 bg-[#010101] text-white">
            <div>AboutMe.dev</div>
          </header>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
