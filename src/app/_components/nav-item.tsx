'use client'

import { ChevronRightIcon, IdentificationIcon } from "@heroicons/react/20/solid"
import classNames from "classnames"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export function NavItem ({ label, href, child, current }: { label: string, href: string, child: boolean, current?: boolean }) {
  return (
    <Link 
      href={href} 
      className={classNames(
        'text-sm h-10 flex items-center space-x-3 hover:bg-[#1F2937] px-2 rounded',
        child ? '' : 'font-semibold',
        current ? 'bg-[#1F2937] opacity-100' : child ? 'opacity-70 hover:opacity-100' : 'opacity-50 hover:opacity-100'
      )}>
      {label}
    </Link>
  )
}


export function NavItemWithChildren ({ label, items, current }: { label: string, current: boolean, items: { label: string, href: string, current: boolean }[] }) {
  const [open, setOpen] = useState(!!current)
  return (
    <div>
      <div 
        onClick={() => setOpen(!open)} 
        className={classNames(
          'px-2 cursor-pointer font-semibold text-sm h-10 flex items-center space-x-3 hover:bg-[#1F2937] group rounded',
        )}>
        <ChevronRightIcon className={classNames('w-5 h-5 text-white', open ? 'rotate-90' : 'rotate-0', current ? 'opacity-100' : 'group-hover:opacity-100 opacity-50')} />
        <div className={classNames(current ? '' : 'group-hover:opacity-100 opacity-50')}>{label}</div>
      </div>
      {open &&
      <div className='pl-4 space-y-1 pt-2'>
        {items.map((item, index) => (
          <NavItem child key={index} label={item.label} href={item.href} current={item.current} />
        ))}
      </div>
      }
    </div>
  )
}

export function Navigation ({ username }: { username?: string }) {
  const pathname = usePathname()
  console.log(1, username)
  return (
    <div className='flex-1 space-y-1'>
      <NavItem href='/' label='Home' child={false} current={pathname === '/'} />
      <NavItem href='/jobs' label='Jobs' child={false} current={pathname === '/jobs'} />
      {username &&
      <NavItemWithChildren
        label='Your Profile' 
        current={pathname.startsWith('/profile') || pathname === `/${username}`}
        items={[
          { label: 'View Your Profile', href: `/${username}`, current: pathname.toLowerCase() === `/${username.toLowerCase()}`},
          { label: 'Personal Information', href: '/profile/personal', current: pathname === '/profile/personal' },
          { label: 'Skills', href: '/profile/skills', current: pathname === '/profile/skills' },
          { label: 'Experience', href: '/profile/experience', current: pathname === '/profile/experience' },
          { label: 'Projects', href: '/profile/projects', current: pathname === '/profile/projects' },
          { label: 'Hobbies & Interests', href: '/profile/hobbies', current: pathname === '/profile/hobbies' },
          { label: 'Teams', href: '/profile/teams', current: pathname === '/profile/teams' },
          { label: 'Updates', href: '/profile/updates', current: pathname === '/profile/updates' },
        ]}
      />
      }
    </div>
  )
}