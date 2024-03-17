'use client'

import { Interest } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

import { api } from '~/trpc/react'
import { UploadButton } from '~/utils/uploadthing'

const SudoPage = () => {
    const skillsQuery = api.post.searchSkills.useQuery({ search: '', exclude: [] })
    const interestsQuery = api.post.searchInterests.useQuery({ search: '', exclude: [] })
    console.log(1, interestsQuery.data)
    return (
        <div className='text-white'>
            <h1 className='text-2xl font-bold mb-5'>Sudo Page</h1>
            <h2 className='font-medium opacity-60'>Skills</h2>
            <ul className='space-y-2'>
                {skillsQuery.data?.map((skill) => (
                    <li key={skill.id} className='flex space-x-4'>
                        <div>{skill.name}</div>
                        {skill.image &&
                            <Image width={32} height={32} src={skill.image} alt={skill.name ?? ''} />
                        }
                        <UploadButton
                            endpoint="skillIcon"
                            input={{ skillId: skill.id }}
                            appearance={{ button: (args) => `bg-white text-black h-6 text-sm px-2 w-auto` }}
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
            <ul className='space-y-2'>
                {interestsQuery.data?.map((skill) => (
                    <Interest key={skill.id} interest={skill} />
                ))}
            </ul>
        </div>
    )
}

const Interest = ({ interest }: { interest: Interest }) => {
    const [image, setImage] = React.useState<string | null>(interest.image)
    const updateInterestMutation = api.post.updateInterest.useMutation()
    return (
        <li className='flex space-x-4'>
            <div>{interest.name}</div>
            <input
                value={image ?? ''}
                className='w-16 bg-transparent border rounded'
                onChange={(e) => setImage(e.target.value)}
                onBlur={() => {
                    if (image) {
                        void updateInterestMutation.mutateAsync({ id: interest.id, image })
                    }
                }}
            />
        </li>
    )
}


export default SudoPage

