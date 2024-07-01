import "~/styles/globals.css";

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { Analytics } from "@vercel/analytics/react"
import { IdentificationIcon } from "@heroicons/react/20/solid";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { ourFileRouter } from "~/app/api/uploadthing/core";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { NavItemWithChildren, Navigation } from "./_components/nav-item";

export const metadata = {
  title: "AboutMe.dev",
  description: "Learn all about my development skills and projects.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const faceEmojis = ['🤩', '🥳', '🥸', '🤪', '🤯', '🤠', '😵‍💫', '🫨', '🙄', '🤔', '😬', '😶', '😀', '😃', '😄', '😁', '😆', '🫥', '🤓', '🦊', '🐼']

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const randomEmoji = faceEmojis[Math.floor(Math.random() * faceEmojis.length)]
  // random rotation between -30 and 30
  const rotation = Math.floor(Math.random() * 60) - 30
  return (
    <html lang="en">
      <body className={`font-sans min-h-screen text-white ${GeistSans.variable}  ${GeistMono.variable} min-h-screen bg-[#0E1623] overflow-x-hidden`}>
        <TRPCReactProvider>
          <div className='flex min-h-screen w-full'>
            <div className='w-[288px] shrink-0 sticky top-0 h-screen pb-6 min-h-full flex flex-col space-y-5 border-r border-[#1C2432] px-6'>
              {/* Header */}
              <div className='flex items-center h-16'>
                <Link href="/" className='text-2xl flex items-center'>
                  <div className='relative text-[40px]'>
                    <span className='opacity-80'>⛶</span>
                    <div
                      style={{ transform: `rotate(${rotation}deg)` }}
                      className='absolute top-[2px] left-[3px] text-[28px]'>
                      {randomEmoji}
                    </div>
                  </div>
                  <span className='opacity-50 text-white text-base ml-2 font-thin'>about<span className='font-medium'>me</span>.<span className='font-mono font-thin'>dev</span></span>
                </Link>
              </div>
              
              {/* Navigation */}
              <div className='flex-1 flex flex-col'>
                <Navigation 
                  username={session?.user?.username ?? undefined}
                />
                {!session?.user 
                ? (
                <Link href="/api/auth/signin" className='text-white opacity-100 hover:opacity-80 text-sm uppercase flex items-center'>
                  <svg width="24" height="32" className='h-4 mr-1' viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.2847 0C7.27967 0 0 7.33333 0 16.4057C0 23.6577 4.66433 29.7963 11.135 31.969C11.944 32.1323 12.2403 31.616 12.2403 31.1817C12.2403 30.8013 12.2137 29.4977 12.2137 28.1393C7.68367 29.1173 6.74033 26.1837 6.74033 26.1837C6.01233 24.2823 4.93367 23.7937 4.93367 23.7937C3.451 22.7887 5.04167 22.7887 5.04167 22.7887C6.68633 22.8973 7.54933 24.4727 7.54933 24.4727C9.005 26.9713 11.3507 26.2653 12.2943 25.8307C12.429 24.7713 12.8607 24.038 13.319 23.6307C9.706 23.2503 5.90467 21.838 5.90467 15.5363C5.90467 13.7437 6.55133 12.277 7.576 11.1363C7.41433 10.729 6.848 9.04467 7.738 6.79033C7.738 6.79033 9.113 6.35567 12.2133 8.47433C13.5407 8.11522 14.9096 7.93254 16.2847 7.931C17.6597 7.931 19.0613 8.12133 20.3557 8.47433C23.4563 6.35567 24.8313 6.79033 24.8313 6.79033C25.7213 9.04467 25.1547 10.729 24.993 11.1363C26.0447 12.277 26.6647 13.7437 26.6647 15.5363C26.6647 21.838 22.8633 23.223 19.2233 23.6307C19.8167 24.1467 20.3287 25.1243 20.3287 26.6727C20.3287 28.8727 20.302 30.6383 20.302 31.1813C20.302 31.616 20.5987 32.1323 21.4073 31.9693C27.878 29.796 32.5423 23.6577 32.5423 16.4057C32.569 7.33333 25.2627 0 16.2847 0Z" fill="white" />
                  </svg>

                  <span>Sign in with GitHub</span>
                </Link>
                )
                : (
                <Link href='/api/auth/signout' className='text-white text-sm hover:opacity-80'>Sign out</Link>
                )
                }
              </div>
            </div>
            <div className='flex-1 min-h-full'>
              <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
              {children}
              <ToastContainer />
              <Analytics />
            </div>
          </div>
        </TRPCReactProvider>
      </body>
      {/* <body className={`font-sans ${GeistSans.variable}  ${GeistMono.variable} min-h-screen bg-[#101C27] overflow-x-hidden`}>
        <TRPCReactProvider>
          <header className="max-w-[1608px] h-[56px] sm:h-[120px] mx-auto flex items-center justify-between px-4 bg-[#0E1923] text-white">
            <Link href="/" className='text-2xl flex items-center'>
              <div className='relative text-[40px]'>
                <span className='opacity-80'>⛶</span>
                <div
                  style={{ transform: `rotate(${rotation}deg)` }}
                  className='absolute top-[2px] left-[3px] text-[28px]'>
                  {randomEmoji}
                </div>
              </div>
              <span className='opacity-50 text-base ml-2 font-thin'>about<span className='font-medium'>me</span>.<span className='font-mono font-thin'>dev</span></span>
            </Link>

            {!session?.user
              ? (
                <Link href="/api/auth/signin" className='bg-white text-black h-8 text-sm sm:text-base hover:opacity-80 sm:h-12 px-4 rounded-full flex items-center'>
                  <span>Sign In / Join</span>
                  <svg width="33" height="32" className='h-5 ml-1' viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.2847 0C7.27967 0 0 7.33333 0 16.4057C0 23.6577 4.66433 29.7963 11.135 31.969C11.944 32.1323 12.2403 31.616 12.2403 31.1817C12.2403 30.8013 12.2137 29.4977 12.2137 28.1393C7.68367 29.1173 6.74033 26.1837 6.74033 26.1837C6.01233 24.2823 4.93367 23.7937 4.93367 23.7937C3.451 22.7887 5.04167 22.7887 5.04167 22.7887C6.68633 22.8973 7.54933 24.4727 7.54933 24.4727C9.005 26.9713 11.3507 26.2653 12.2943 25.8307C12.429 24.7713 12.8607 24.038 13.319 23.6307C9.706 23.2503 5.90467 21.838 5.90467 15.5363C5.90467 13.7437 6.55133 12.277 7.576 11.1363C7.41433 10.729 6.848 9.04467 7.738 6.79033C7.738 6.79033 9.113 6.35567 12.2133 8.47433C13.5407 8.11522 14.9096 7.93254 16.2847 7.931C17.6597 7.931 19.0613 8.12133 20.3557 8.47433C23.4563 6.35567 24.8313 6.79033 24.8313 6.79033C25.7213 9.04467 25.1547 10.729 24.993 11.1363C26.0447 12.277 26.6647 13.7437 26.6647 15.5363C26.6647 21.838 22.8633 23.223 19.2233 23.6307C19.8167 24.1467 20.3287 25.1243 20.3287 26.6727C20.3287 28.8727 20.302 30.6383 20.302 31.1813C20.302 31.616 20.5987 32.1323 21.4073 31.9693C27.878 29.796 32.5423 23.6577 32.5423 16.4057C32.569 7.33333 25.2627 0 16.2847 0Z" fill="black" />
                  </svg>
                </Link>
              )
              : (
                <Link href='/api/auth/signout' className='text-white text-sm hover:opacity-80'>Sign out</Link>
              )
            }
          </header>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          {children}
          <ToastContainer />
          <Analytics />
        </TRPCReactProvider>
      </body> */}
    </html>
  );
}
