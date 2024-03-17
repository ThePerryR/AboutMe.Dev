'use client'

import Image from 'next/image'
import React from 'react'

import { api } from '~/trpc/react'
import { UploadButton } from '~/utils/uploadthing'

const SudoPage = () => {
    const skillsQuery = api.post.searchSkills.useQuery({ search: '', exclude: [] })
    return (
        <div className='text-white'>
            <h1 className='text-2xl font-bold mb-5'>Sudo Page</h1>
            <h2 className='font-medium opacity-60'>Skills</h2>
            <ul className='space-x-2'>
                {skillsQuery.data?.map((skill) => (
                    <li key={skill.id} className='flex space-x-4'>
                        <div>{skill.name}</div>
                        {skill.image &&
                        <Image width={32} height={32} src={skill.image} alt={skill.name ?? ''} />
                        }
                        <UploadButton
                            endpoint="skillIcon"
                            input={{ skillId: skill.id }}
                            appearance={{  button: (args) => `bg-white text-black h-6 text-sm px-2 w-auto` }}
                            onClientUploadComplete={(res) => {
                                void skillsQuery.refetch()
                            }}
                            onUploadError={(error: Error) => {
                                // setUploadError('Invalid image. Max size is 4MB')
                            }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}


export default SudoPage

