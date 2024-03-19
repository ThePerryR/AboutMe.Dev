'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import classNames from 'classnames'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const Navigation = ({ username }: { username: string }) => {
    const pathname = usePathname()

    return (
        <>
            <div className='hidden sm:block'>
                <div className='space-y-3 mb-20'>
                    <div>
                        <Link href='/'>
                            <div className={classNames(pathname === '/' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Personal Information</div>
                        </Link>
                    </div>
                    <div>
                        <Link href='/interest'>
                            <div className={classNames(pathname === '/interest' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Hobbies & Interests</div>
                        </Link>
                    </div>
                    <div>
                        <Link href='/skills'>
                            <div className={classNames(pathname === '/skills' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Skills</div>
                        </Link>
                    </div>
                    <div>
                        <Link href='/experience'>
                            <div className={classNames(pathname === '/experience' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Experience</div>
                        </Link>
                    </div>
                    <div>
                        <Link href='/projects'>
                            <div className={classNames(pathname === '/projects' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Projects</div>
                        </Link>
                    </div>
                    {/* <div>
                        <Link href='/calendar'>
                            <div className={classNames(pathname === '/calendar' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Calendar</div>
                        </Link>
                    </div> */}
                </div>

                <Link href={`/${username}`} target='_blank' className='flex items-center space-x-1 group'>
                    <div className={classNames('text-opacity-50 group-hover:text-opacity-80', 'text-sm transition-all text-white')}>View Profile</div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 opacity-80 group-hover:opacity-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                </Link>
            </div>
            <div className='sm:hidden w-full'>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <div className='text-white text-sm transition-all justify-center bg-white bg-opacity-10 w-full h-10 mb-4 cursor-pointer hover:bg-opacity-5 flex items-center px-3 border-white border-opacity-20 border rounded'>
                            {pathname === '/' && 'Personal Information'}
                            {pathname === '/interest' && 'Hobbies & Interests'}
                            {pathname === '/skills' && 'Skills'}
                            {pathname === '/experience' && 'Experience'}
                            {pathname === '/projects' && 'Projects'}
                            {pathname === '/calendar' && 'Calendar'}
                        </div>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            className="min-w-[220px] pb-4 bg-gray-600 w-full rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                            sideOffset={5}>
                            <DropdownMenu.Label />
                            <div className='space-y-3 mb-4'>
                                <div>
                                    <DropdownMenu.Item asChild>
                                        <Link href='/'>
                                            <div className={classNames(pathname === '/' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Personal Information</div>
                                        </Link>
                                    </DropdownMenu.Item>
                                </div>
                                <div>
                                    <DropdownMenu.Item asChild>
                                        <Link href='/interest'>
                                            <div className={classNames(pathname === '/interest' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Hobbies & Interests</div>
                                        </Link>
                                    </DropdownMenu.Item>
                                </div>
                                <div>
                                    <DropdownMenu.Item asChild>
                                        <Link href='/skills'>
                                            <div className={classNames(pathname === '/skills' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Skills</div>
                                        </Link>
                                    </DropdownMenu.Item>
                                </div>
                                <div>
                                    <DropdownMenu.Item asChild>
                                        <Link href='/experience'>
                                            <div className={classNames(pathname === '/experience' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Experience</div>
                                        </Link>
                                    </DropdownMenu.Item>
                                </div>
                                <div>
                                    <DropdownMenu.Item asChild>
                                        <Link href='/projects'>
                                            <div className={classNames(pathname === '/projects' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Projects</div>
                                        </Link>
                                    </DropdownMenu.Item>
                                </div>
                                <div>
                                    <DropdownMenu.Item asChild>
                                        <Link href='/calendar'>
                                            <div className={classNames(pathname === '/calendar' ? 'text-opacity-80 hover:text-opacity-80' : 'text-opacity-50 hover:text-opacity-80', 'text-sm transition-all text-white',)}>Calendar</div>
                                        </Link>
                                    </DropdownMenu.Item>
                                </div>
                            </div>

                            <DropdownMenu.Separator className="h-[1px] bg-white bg-opacity-30 mb-4"  />

                            <DropdownMenu.Item asChild>
                                <Link href={`/${username}`} target='_blank' className='flex items-center space-x-1 group'>
                                    <div className={classNames('text-opacity-50 group-hover:text-opacity-80', 'text-sm transition-all text-white')}>View Profile</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-white text-opacity-80 opacity-80 group-hover:opacity-100">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </Link>
                            </DropdownMenu.Item>
                            <DropdownMenu.Arrow />
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        </>
    )
}

export default Navigation
