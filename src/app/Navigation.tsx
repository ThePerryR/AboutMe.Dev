'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import classNames from 'classnames'

const Navigation = ({ username }: { username: string }) => {
    const pathname = usePathname()

    return (
        <div>
            <div className='space-y-3 mb-20'>
                <div>
                    <Link href='/'>
                        <div className={classNames(pathname === '/' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Personal Information</div>
                    </Link>
                </div>
                <div>
                    <Link href='/projects'>
                        <div className={classNames(pathname === '/projects' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Projects</div>
                    </Link>
                </div>
                <div>
                    <Link href='/calendar'>
                        <div className={classNames(pathname === '/calendar' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Calendar</div>
                    </Link>
                </div>
            </div>

            <Link href={`/${username}`} target='_blank' className='flex items-center space-x-1 group'>
                <div className={classNames('text-opacity-50 group-hover:text-opacity-80', 'text-sm transition-all text-white')}>View Profile</div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 opacity-80 group-hover:opacity-100">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
            </Link>
        </div>
    )
}

export default Navigation
