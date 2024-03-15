import React from 'react'
import Navigation from '../Navigation'
import { getServerAuthSession } from '~/server/auth';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerAuthSession();
    if (session === null) return null
    return (
        <main className="text-white flex flex-col items-center py-4 md:py-6 px-4">
            <h1 className='font-mono text-2xl mb-10'>Welcome {session.user.name}</h1>
            <div className='flex space-x-20 w-full max-w-[800px] mx-auto'>
                <Navigation username={session.user.username} />
                <div className='flex w-full max-w-3xl flex-1 flex-col space-y-8'>
                    {children}
                </div>
            </div>
        </main>
    )
}

export default Layout
