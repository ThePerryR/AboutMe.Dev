'use client'

import { Interest } from '@prisma/client'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { api } from '~/trpc/react'
import { UploadButton } from '~/utils/uploadthing'

const Main = () => {
    const [view, setView] = React.useState<'skills' | 'interests' | 'users'>('skills')
    const skillsQuery = api.post.searchSkills.useQuery({ search: '', exclude: [] })
    const interestsQuery = api.post.searchInterests.useQuery({ search: '', exclude: [] })
    const usersQuery = api.post.fetchUsers.useQuery()
    const updateSkillMutation = api.post.updateSkill.useMutation()
    return (
        <div>
            <div className='flex items-center space-x-4 text-white mb-8 border-b border-white pb-4 px-4'>
                <div onClick={() => setView('skills')} className={classNames('cursor-pointer', view === 'skills' ? '' : 'opacity-40')}>Skills</div>
                <div onClick={() => setView('interests')} className={classNames('cursor-pointer', view === 'interests' ? '' : 'opacity-40')}>Interests</div>
                <div onClick={() => setView('users')} className={classNames('cursor-pointer', view === 'users' ? '' : 'opacity-40')}>Users</div>
            </div>
            <div className='text-white px-4'>
                {view === 'skills' && (
                    <div className='flex space-x-20 w-full'>
                        <div className='w-full'>
                            <h2 className='font-medium uppercase opacity-70 text-lg mb-8'>Skills</h2>
                            <ul className='w-full border border-white divide-y border-opacity-20 divide-white divide-opacity-20'>
                                {skillsQuery.data?.map((skill) => (
                                    <li key={skill.id} className='flex items-center space-x-4 py-2 px-3 w-full'>
                                        <div className='flex-1 max-w-[280px]'>{skill.name}</div>
                                        {skill.image &&
                                            <div className='w-[32px] h-[32px] border-white border border-opacity-20'>
                                                <Image width={32} height={32} src={skill.image} alt={skill.name ?? ''} className='object-contain w-full h-full' />
                                            </div>
                                        }
                                        <UploadButton
                                            endpoint="skillIcon"
                                            input={{ skillId: skill.id }}
                                            appearance={{ 
                                                button: (args) => `bg-transparent opacity-50 hover:opacity-80 text-white h-6 text-sm p-0 w-auto`,
                                                allowedContent: (args) => `hidden`
                                            }}
                                            onClientUploadComplete={(res) => {
                                                void skillsQuery.refetch()
                                            }}
                                            onUploadError={(error: Error) => {
                                                // setUploadError('Invalid image. Max size is 4MB')
                                            }}
                                        />

                                        <div className='flex flex-1 items-center justify-end'>
                                            <select
                                                value={skill.type ?? ''}
                                                onChange={async (e) => {
                                                    if (e.target.type !== '') {
                                                        await updateSkillMutation.mutateAsync({ id: skill.id, type: e.target.value })
                                                        void skillsQuery.refetch()
                                                    }
                                                }}
                                                className='bg-transparent border-white border-opacity-30 text-white text-opacity-40 border rounded'>
                                                <option value=''>Select One...</option>
                                                <option value='language'>Language</option>
                                                <option value='library'>Library</option>
                                                <option value='framework'>Framework</option>
                                                <option value='tool'>Tool</option>
                                            </select>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {view === 'users' && (
                    <div>
                        <h2 className='font-medium opacity-60'>Users</h2>
                        <div>
                            {usersQuery.data?.map((user) => (
                                <div key={user.id} className='flex space-x-4'>
                                    <div>{user.flair}</div>
                                    <div>{user.name}</div>
                                    <Link href={`https://www.aboutme.dev/${user.username}`}>
                                        <div>{user.username}</div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'interests' && (
                    <ul className='space-y-2'>
                        {interestsQuery.data?.map((skill) => (
                            <Interest key={skill.id} interest={skill} />
                        ))}
                    </ul>
                )}
            </div>
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
export default Main
