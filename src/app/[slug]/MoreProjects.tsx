'use client'

import { type Skill } from '@prisma/client'
import React from 'react'
import SkillShow from './Skill'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames'


const MoreProjects = ({ projects }: { projects: { id: number, name: string | null, url: string | null, image: string | null, headline: string | null, status: string | null, skills: { id: number, image: string | null }[] }[] }) => {
    const [showMore, setShowMore] = React.useState(false)
    return (
        <div className='mt-2'>
            <div className={classNames('max-h-0 overflow-hidden transition-all duration-300', { 'max-h-[1000px]': showMore })}>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
                    {projects.map(project => {
                        return (
                            <div key={project.id} className='rounded  border-opacity-10 flex flex-col'>
                                {project.image
                                    ? (
                                        <Link href={project.url ?? ''} target='_blank'>
                                            <Image src={project.image ?? ''} alt='project' width={600} height={315} className='rounded mb-2 aspect-[1200/630] object-cover' />
                                        </Link>
                                    )
                                    : (
                                        <div className='border-white border border-dashed border-opacity-20 aspect-[1200/630] rounded mb-2 bg-white bg-opacity-5 opacity-80'>
                                        </div>
                                    )
                                }
                                <div className='flex items-center justify-between mb-2'>
                                    {project.url
                                        ? (
                                            <Link href={project.url} target="_blank" className='flex items-center'>
                                                <div className='text-sm opacity-80'>{project.name}</div>
                                                <div className='ml-2 opacity-40'>
                                                    {project.url.includes('github.com')
                                                        ? (
                                                            <svg width="33" height="32" className='h-[14px] w-[14px]' viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M16.2847 0C7.27967 0 0 7.33333 0 16.4057C0 23.6577 4.66433 29.7963 11.135 31.969C11.944 32.1323 12.2403 31.616 12.2403 31.1817C12.2403 30.8013 12.2137 29.4977 12.2137 28.1393C7.68367 29.1173 6.74033 26.1837 6.74033 26.1837C6.01233 24.2823 4.93367 23.7937 4.93367 23.7937C3.451 22.7887 5.04167 22.7887 5.04167 22.7887C6.68633 22.8973 7.54933 24.4727 7.54933 24.4727C9.005 26.9713 11.3507 26.2653 12.2943 25.8307C12.429 24.7713 12.8607 24.038 13.319 23.6307C9.706 23.2503 5.90467 21.838 5.90467 15.5363C5.90467 13.7437 6.55133 12.277 7.576 11.1363C7.41433 10.729 6.848 9.04467 7.738 6.79033C7.738 6.79033 9.113 6.35567 12.2133 8.47433C13.5407 8.11522 14.9096 7.93254 16.2847 7.931C17.6597 7.931 19.0613 8.12133 20.3557 8.47433C23.4563 6.35567 24.8313 6.79033 24.8313 6.79033C25.7213 9.04467 25.1547 10.729 24.993 11.1363C26.0447 12.277 26.6647 13.7437 26.6647 15.5363C26.6647 21.838 22.8633 23.223 19.2233 23.6307C19.8167 24.1467 20.3287 25.1243 20.3287 26.6727C20.3287 28.8727 20.302 30.6383 20.302 31.1813C20.302 31.616 20.5987 32.1323 21.4073 31.9693C27.878 29.796 32.5423 23.6577 32.5423 16.4057C32.569 7.33333 25.2627 0 16.2847 0Z" fill="white" />
                                                            </svg>
                                                        )
                                                        : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 text-white">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                                            </svg>

                                                        )
                                                    }
                                                </div>
                                            </Link>
                                        )
                                        :
                                        <div className='text-sm opacity-100'>{project.name}</div>
                                    }
                                    {project.status === 'live' &&
                                        <div className='bg-green-500 text-black text-[12px] px-2 rounded-full'>Live</div>
                                    }
                                    {project.status === 'live-beta' &&
                                        <div className='bg-blue-500 text-black text-[12px] px-2 rounded-full'>Beta</div>
                                    }
                                    {project.status === 'in-progress' &&
                                        <div className='bg-yellow-500 text-black text-[12px] px-2 rounded-full'>In Progress</div>
                                    }
                                    {project.status === 'idea' &&
                                        <div className='bg-gray-500 text-black text-[12px] px-2 rounded-full'>Idea</div>
                                    }
                                    {project.status === 'paused' &&
                                        <div className='bg-gray-500 text-black text-[12px] px-2 rounded-full'>Paused</div>
                                    }
                                    {project.status === 'inactive' &&
                                        <div className='bg-gray-500 text-black text-[12px] px-2 rounded-full'>Inactive</div>
                                    }

                                </div>
                                <div className='text-sm text-opacity-40 text-white'>{project.headline}</div>
                                <div className='flex mt-1 justify-between'>
                                    <div className='flex flex-wrap gap-0'>
                                        {project.skills.filter(s => !!s.image && typeof s.image === 'string').map(s => {
                                            const skill = s as Skill & { image: string }
                                            return (
                                                <SkillShow key={skill.id} skill={skill} />
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className=''>
                <div
                    onClick={() => setShowMore(!showMore)}
                    className='opacity-100 tracking-wide text-blue-500 hover:text-blue-400 font-medium uppercase text-xs cursor-pointer'>
                    {showMore ? 'Show Less' : 'Show All'}
                </div>
            </div>
        </div>
    )
}

export default MoreProjects
