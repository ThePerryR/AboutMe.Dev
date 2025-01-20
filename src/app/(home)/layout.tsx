import React from 'react'
import Navigation from '../Navigation'
import { getServerAuthSession } from '~/server/auth';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerAuthSession();
    if (session === null) return (
        <>
          {children}
        </>
    )
    return (
        <main className="text-white h-full flex flex-col flex-1 bg-[#0A0A0A]">
          {children}
        </main>
    )
}

export default Layout
