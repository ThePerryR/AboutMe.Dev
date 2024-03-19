'use client'

import React from 'react'
import SkillList from './SkillList'
import { api } from '~/trpc/react'

const Skills = () => {
    const skillsQuery = api.post.getSkills.useQuery()
    const addSkillMutation = api.post.addSkill.useMutation({
        onSuccess: () => {
            void skillsQuery.refetch()
        }
    })
    const toggleSkillMutation = api.post.toggleSkill.useMutation({
        onSuccess: () => {
            void skillsQuery.refetch()
        }
    })
    return (
        <div className='space-y-6'>
            <div className='bg-black border-white border rounded border-opacity-10'>
                <div className='flex flex-col sm:flex-row p-4 space-y-4 bg-white bg-opacity-5'>
                    <div className='sm:w-[250px] shrink-0'>
                        <div className='text-sm'>Primary Stack</div>
                        <div className='text-sm opacity-60'>Add the languages and frameworks that you primarily use.</div>
                    </div>

                    <div className='flex-1'>
                        <SkillList
                            allSkills={skillsQuery.data?.map(skill => skill.skill) ?? []}
                            skills={skillsQuery.data?.filter(skill => skill.primary).map(skill => skill.skill) ?? []}
                            toggleSkill={async (id) => {
                                await toggleSkillMutation.mutateAsync({ id, primary: true })
                            }}
                            addSkill={async (name) => {
                                await addSkillMutation.mutateAsync({ name, type: 'language', primary: true })
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='bg-black border-white border rounded border-opacity-10'>
                <div className='flex flex-col sm:flex-row p-4 space-y-4 bg-white bg-opacity-5'>
                    <div className='sm:w-[250px] shrink-0'>
                        <div className='text-sm'>Other Skills</div>
                        <div className='text-sm opacity-60'>Add any other languages, libraries, frameworks, or tools you know.</div>
                    </div>

                    <div className='flex-1'>
                        <SkillList
                            allSkills={skillsQuery.data?.map(skill => skill.skill) ?? []}
                            skills={skillsQuery.data?.filter(skill => !skill.primary).map(skill => skill.skill) ?? []}
                            toggleSkill={async (id) => {
                                await toggleSkillMutation.mutateAsync({ id, primary: false })
                            }}
                            addSkill={async (name) => {
                                await addSkillMutation.mutateAsync({ name, type: '', primary: false })
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Skills
