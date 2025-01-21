'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import classNames from 'classnames'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface NavItemProps {
    href: string
    label: string
    pathname: string
    asDropdownItem?: boolean
}

const NavItem = ({ href, label, pathname, asDropdownItem = false }: NavItemProps) => {
    const Component = asDropdownItem ? DropdownMenu.Item : 'div'
    
    return (
        <Component asChild={asDropdownItem}>
            <Link href={href}>
                <div 
                  className={classNames(
                    (href === '/profile' ? href === pathname : pathname.startsWith(href)) ? 'text-[#F1F1F1] hover:text-[#F1F1F1] bg-[#343434]' : 'text-opacity-50 hover:text-opacity-80',
                    'text-sm py-1.5 rounded-md px-2 font-medium transition-all text-white',
                  )}>
                    {label}
                </div>
            </Link>
        </Component>
    )
}

const Navigation = ({ username }: { username: string }) => {
    const pathname = usePathname()

    const navItems = [
        { href: '/profile', label: 'Personal Information' },
        { href: '/profile/hobbies', label: 'Hobbies & Interests' },
        { href: '/profile/skills', label: 'Skills' },
        { href: '/profile/experience', label: 'Experience' },
        { href: '/profile/projects', label: 'Projects' },
    ]

    const mobileNavItems = [
        { href: '/', label: 'Personal Information' },
        { href: '/interest', label: 'Hobbies & Interests' },
        { href: '/skills', label: 'Skills' },
        { href: '/experience', label: 'Experience' },
        { href: '/projects', label: 'Projects' },
    ]

    return (
        <>
            <div className='hidden md:block'>
                <div className='mb-20 px-4'>
                    {navItems.map((item) => (
                        <div key={item.href}>
                            <NavItem href={item.href} label={item.label} pathname={pathname} />
                        </div>
                    ))}
                </div>

                <div className='px-6'>
                  <Link href={`/${username}`} target='_blank' className='flex items-center space-x-1 group'>
                    <div className={classNames('text-opacity-50 group-hover:text-opacity-80', 'text-sm transition-all text-white')}>View Profile</div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 opacity-80 group-hover:opacity-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </Link>
                </div>
            </div>
            <div className='md:hidden w-full'>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <div className='text-white text-sm transition-all justify-center bg-white bg-opacity-10 w-full h-10 cursor-pointer hover:bg-opacity-5 flex items-center px-3 border-white border-opacity-20 border rounded'>
                            {pathname === '/profile' && 'Personal Information'}
                            {pathname === '/profile/hobbies' && 'Hobbies & Interests'}
                            {pathname === '/profile/skills' && 'Skills'}
                            {pathname === '/profile/experience' && 'Experience'}
                            {pathname === '/profile/projects' && 'Projects'}
                        </div>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            className="min-w-[220px] pb-4 bg-gray-600 w-full rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                            sideOffset={5}>
                            <DropdownMenu.Label />
                            <div className='space-y-3 mb-4'>
                                {navItems.map((item) => (
                                    <div key={item.href}>
                                        <NavItem 
                                            href={item.href} 
                                            label={item.label} 
                                            pathname={pathname}
                                            asDropdownItem
                                        />
                                    </div>
                                ))}
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
