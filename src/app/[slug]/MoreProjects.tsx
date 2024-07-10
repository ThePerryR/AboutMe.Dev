'use client'

import { type Skill } from '@prisma/client'
import React from 'react'
import SkillShow from './Skill'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames'
import ProjectCard from './ProjectCard'


const MoreProjects = ({ projects }: { projects: { id: number, name: string | null, headline: string | null, image: string | null, url: string | null, status: string | null, skills: { id: number; name: string | null; type: string | null; image: string | null; }[] }[] }) => {
    const [showMore, setShowMore] = React.useState(false)
    return (
        <div className=''>
            <div className={classNames('max-h-0 overflow-hidden transition-all duration-300', { 'max-h-[1000px] mt-6': showMore })}>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
                    {projects.map(project => {
                        return (
                            <ProjectCard key={project.id} project={project} />
                        )
                    })}
                </div>
            </div>
            <div className='mt-3'>
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
