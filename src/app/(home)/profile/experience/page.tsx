'use client'

import { type Experience } from '@prisma/client'
import classNames from 'classnames'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { api } from '~/trpc/react'
import { UploadButton } from '~/utils/uploadthing'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
    const experienceQuery = api.post.fetchExperiences.useQuery()
    const createExperienceMutation = api.post.createExperience.useMutation({
        onSuccess: () => {
            void experienceQuery.refetch()
        }
    })
    useEffect(() => {
        if (experienceQuery.data) {
          setExperiences(experienceQuery.data.sort((a, b) => (b.startDate ? b.startDate.getTime() : 0) - (a.startDate ? a.startDate.getTime() : 0)))
        }
    }, [experienceQuery.data])
    if (!experienceQuery.isSuccess) {
        return <div>Loading...</div>
    }
    return (
        <div className='w-full px-8 py-8'>
            <div className='flex items-center justify-between mb-4'>
              <div className="mb-1 font-medium">Experience</div>
                <button className='text-black bg-white text-sm rounded px-2 py-2' onClick={() => { createExperienceMutation.mutate() }}>
                    {createExperienceMutation.isLoading ? 'One moment...' : 'Add a new experience'}
                  </button>
            </div>
            {experiences.length === 0
                ? (
                    <div className='bg-white bg-opacity-5 border-white border-opacity-10 border rounded-lg items-center py-20 border-dashed flex flex-col'>
                        <div className='text-sm opacity-60'>
                            {'No projects'}
                        </div>
                    </div>
                )
                : (
                    <div className='space-y-10 mt-10'>
                        {experiences.map((experience) => (
                            <ExperienceCard
                                key={experience.id}
                                experience={experience}
                                refetch={() => {
                                    void experienceQuery.refetch()
                                
                                }}
                            />
                        ))}
                    </div>
                )}
        </div>
    )
}

const ExperienceCard = ({ experience, refetch }: { experience: Experience, refetch: () => void }) => {
    const [role, setRole] = useState(experience.role)
    const [company, setCompany] = useState(experience.company)
    const [description, setDescription] = useState(experience.description)
    const [companyLogo, setCompanyLogo] = useState(experience.companyLogo)
    const [startMonth, setStartMonth] = useState(experience.startDate ? new Date(experience.startDate).getMonth() : undefined)
    const [startYear, setStartYear] = useState(experience.startDate ? new Date(experience.startDate).getFullYear() : undefined)
    const [endMonth, setEndMonth] = useState(experience.endDate ? new Date(experience.endDate).getMonth() : undefined)
    const [endYear, setEndYear] = useState(experience.endDate ? new Date(experience.endDate).getFullYear() : undefined)
    const [isCurrent, setIsCurrent] = useState(experience.isCurrent)
    const updateExperienceMutation = api.post.updateExperience.useMutation()
    const deleteExperienceMutation = api.post.deleteExperience.useMutation({
        onSuccess: () => {
            refetch()
        }
    })
    const canSave = role !== experience.role || company !== experience.company || startMonth !== (experience.startDate ? new Date(experience.startDate).getMonth() : undefined) || startYear !== (experience.startDate ? new Date(experience.startDate).getFullYear() : undefined) || endMonth !== (experience.endDate ? new Date(experience.endDate).getMonth() : undefined) || endYear !== (experience.endDate ? new Date(experience.endDate).getFullYear() : undefined) || isCurrent !== experience.isCurrent || description !== experience.description
    return (
        <div className=' border-white/10 border rounded'>
            <div className='flex flex-col px-8 py-8 space-y-4'>
                <div className='flex items-center'>
                    <div className='text-sm mb-1 w-[180px] shrink-0'>Company Name</div>
                    <input
                        type='text'
                        value={company ?? ''}
                        placeholder={`Bob's Widgets Inc.`}
                        onChange={(e) => setCompany(e.target.value)}
                        className='bg-white/5 border-white/10 max-w-[400px] border rounded border-opacity-10 p-2 w-full'
                    />
                </div>
                <div className='flex items-center'>
                    <div className='flex flex-col items-start w-[180px]'>
                        <div className='text-sm mb-1'>Company Logo</div>
                    </div>
                    <div className='flex-1 flex justify-start'>
                        <div className='mr-4 text-xs text-opacity-30 bg-white/5 text-white border-white border-opacity-10  h-[40px] rounded flex items-center justify-center border'>
                            {companyLogo !== null
                                ? (
                                    <Image
                                        src={companyLogo}
                                        width={300}
                                        height={157.5}
                                        alt='image preview'
                                        className='h-full w-auto object-cover'
                                    />
                                )
                                : <div className='px-10'>No Image</div>
                            }
                        </div>
                        <UploadButton
                            endpoint="companyLogo"
                            input={{ experienceId: experience.id }}
                            className=''
                            appearance={{
                              button: (args) => `bg-white/10 hover:bg-white/20 text-white h-[36px] text-sm px-3 w-auto`,
                              allowedContent: (args) => 'text-xs text-gray-400 hidden',
                            }}
                            onUploadBegin={() => {
                                // setUploadError(undefined)
                            }}
                            onClientUploadComplete={(res) => {
                                setCompanyLogo(res[0]?.url ?? null)
                            }}
                            onUploadError={(error: Error) => {
                                // setUploadError('Invalid image. Max size is 4MB')
                            }}
                        />
                    </div>
                </div>

                <div className='flex items-center'>
                    <div className='text-sm mb-1 w-[180px] shrink-0'>Role</div>
                    <input
                        type='text'
                        value={role ?? ''}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder='Software Engineer'
                        className='bg-white/5 border-white/10 max-w-[400px] border rounded border-opacity-10 p-2 w-full'
                    />
                </div>
                <div className='flex items-center'>
                    <div className='text-sm mb-1 w-[180px] shrink-0'>Start Date</div>
                    <select
                        value={startMonth ?? ''}
                        onChange={(e) => setStartMonth(Number(e.target.value))}
                        className='bg-white/5 border-white/10 border rounded border-opacity-10 p-2 flex-1 max-w-[140px] mr-2'>
                        <option value='' disabled>Month</option>
                        {Array(12).fill(null).map((_, i) => (
                            <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                    </select>
                    <input
                        type='number'
                        placeholder='2024'
                        value={startYear ?? ''}
                        onChange={(e) => setStartYear(Number(e.target.value))}
                        className='bg-white/5 border-white/10 border rounded border-opacity-10 p-2 w-full max-w-[100px]'
                    />
                </div>
                <div className='flex'>
                    <div className='text-sm mb-1 w-[180px] shrink-0 mt-3'>End Date</div>
                    <div className='flex-1'>
                        {!isCurrent &&
                            <div className='flex w-full'>
                                <select
                                    value={endMonth ?? ''}
                                    onChange={(e) => setEndMonth(Number(e.target.value))}
                                    className='bg-white/5 border-white/10 border rounded border-opacity-10 p-2 flex-1 max-w-[140px] mr-2'>
                                    <option value='' disabled>Month</option>
                                    {Array(12).fill(null).map((_, i) => (
                                        <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                    ))}
                                </select>
                                <input
                                    type='number'
                                    placeholder='2024'
                                    value={endYear ?? ''}
                                    onChange={(e) => setEndYear(Number(e.target.value))}
                                    className='bg-white/5 border-white/10  border rounded border-opacity-10 p-2 w-full max-w-[100px]'
                                />
                            </div>
                        }
                        <div className='flex items-center mt-1 text-sm'>
                            <input
                                type='checkbox'
                                checked={isCurrent}
                                onChange={(e) => {
                                    setIsCurrent(e.target.checked)
                                    if (e.target.checked) {
                                        setEndMonth(undefined)
                                        setEndYear(undefined)
                                    }
                                }}
                                className='mr-1'
                            />
                            <label>Current</label>
                        </div>
                    </div>
                </div>

                <div className='flex'>
                    <div className='text-sm mb-1 w-[180px] shrink-0'>Description</div>
                    <div className='flex-1'>
                        <textarea 
                            value={description ?? ''}
                            placeholder='What does this place do, what you did, and why you left.'
                            onChange={(e) => setDescription(e.target.value)}
                            className='bg-white/5 border-white/10 border rounded border-opacity-10 p-2 w-full h-24'
                        />
                    </div>
                </div>
            </div>
            <div className='flex justify-end p-4'>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger className='px-2 mr-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
                        </svg>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className='bg-white py-2 rounded'>
                            <DropdownMenu.Item
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this experience?")) {
                                        deleteExperienceMutation.mutate(experience.id)
                                    }
                                }}
                                className='px-3 text-red-500 font-medium text-sm cursor-pointer hover:bg-gray-200 h-8 flex items-center'>
                                <div>Delete Experience</div>
                            </DropdownMenu.Item>
                            <DropdownMenu.Arrow className='fill-white' />
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
                <div
                    onClick={async () => {
                        updateExperienceMutation.mutate({
                            id: experience.id,
                            role: role ?? undefined,
                            company: company ?? undefined,
                            description: description ?? undefined,
                            startDate: startMonth && startYear ? new Date(startYear, startMonth).toISOString() : undefined,
                            endDate: isCurrent ? undefined : endMonth && endYear ? new Date(endYear, endMonth).toISOString() : undefined,
                            isCurrent
                        })
                    }}
                    className={classNames('px-2 h-8 flex items-center text-sm rounded w-auto', (canSave || updateExperienceMutation.isLoading) ? 'bg-white text-black cursor-pointer' : 'bg-gray-600 bg-opacity-20 border border-white border-opacity-5 text-white text-opacity-20')}>
                    {updateExperienceMutation.isLoading ? 'Saving...' : 'Save'}
                </div>
            </div>
        </div>
    )
}
export default ExperiencePage
