'use client'

import classNames from 'classnames';
import Image from 'next/image';
import React, { useState } from 'react'

type Props = {
    skills: {
        id: number;
        name: string | null;
        type: string | null;
        primary: boolean;
        image: string | null;
    }[],
    forceOpen?: boolean
}

const SkillSection = ({ skills, forceOpen }: Props) => {
    const [open, setOpen] = useState(forceOpen ?? false)
    const languages = skills.filter(skill => skill.type === 'language')
    const library = skills.filter(skill => skill.type === 'library')
    const framework = skills.filter(skill => skill.type === 'framework')
    const tool = skills.filter(skill => skill.type === 'tool')
    return (
        <div className='flex flex-col items-start'>
            <div className={classNames(!open ? 'max-h-0' : 'max-h-[480px] mt-4', 'w-full mb-4 overflow-hidden transition-all duration-300')}>
                <div className='w-full space-y-8'>
                    {languages.length > 0 &&
                      <SkillList skills={languages} label='Languages' />
                    }
                    {library.length > 0 &&
                      <SkillList skills={library} label='Libraries' />
                    }
                    {framework.length > 0 &&
                      <SkillList skills={framework} label='Frameworks' />
                    }
                    {tool.length > 0 &&
                      <SkillList skills={tool} label='Tools' />
                    }
                </div>
            </div>
            {!forceOpen &&
            <div
                onClick={() => setOpen(!open)}
                className='opacity-100 tracking-wide text-blue-500 hover:text-blue-400 font-medium uppercase text-xs cursor-pointer'>
                {open ? 'Show Less' : 'Show All'}
            </div>
            }
        </div>
    )
}

const SkillList = ({ skills, label }: { skills: Props['skills'], label?: string }) => {
    return (
        <div className='w-full flex'>
            <div className='w-[120px] shrink-0'>
                <div className='text-sm text-white opacity-40'>{label}</div>
            </div>
            <div className='flex-1 flex flex-wrap gap-y-2 gap-x-4'>
                {skills.map(skill => (
                    <div key={skill.id} className='flex items-center space-x-2'>
                        {skill.image &&
                            <Image src={skill.image} width={20} height={20} alt={skill.name ?? ''} />
                        }
                        <div>{skill.name}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default SkillSection
