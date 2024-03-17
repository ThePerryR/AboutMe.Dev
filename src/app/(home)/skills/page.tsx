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
                <div className='flex p-4 space-y-4 bg-white bg-opacity-5'>
                    <div className='w-[250px] shrink-0'>
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
                <div className='flex p-4 space-y-4 bg-white bg-opacity-5'>
                    <div className='w-[250px] shrink-0'>
                        <div className='text-sm'>Other languages</div>
                        <div className='text-sm opacity-60'>Add any languages you know here such as Javascript, Typescript, Python, etc.</div>
                    </div>

                    <div className='flex-1'>
                        <SkillList
                            allSkills={skillsQuery.data?.map(skill => skill.skill) ?? []}
                            skills={skillsQuery.data?.filter(skill => !skill.primary && skill.skill.type === 'language').map(skill => skill.skill) ?? []}
                            toggleSkill={async (id) => {
                                await toggleSkillMutation.mutateAsync({ id, primary: false })
                            }}
                            addSkill={async (name) => {
                                await addSkillMutation.mutateAsync({ name, type: 'language', primary: false })
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='bg-black border-white border rounded border-opacity-10'>
                <div className='flex p-4 space-y-4 bg-white bg-opacity-5'>
                    <div className='w-[250px] shrink-0'>
                        <div className='text-sm'>Other Libraries</div>
                        <div className='text-sm opacity-60'>Add any libraries you know here such as React, Vue, JQuery, Three.js, etc.</div>
                    </div>

                    <div className='flex-1'>
                        <SkillList
                            allSkills={skillsQuery.data?.map(skill => skill.skill) ?? []}
                            skills={skillsQuery.data?.filter(skill => !skill.primary && skill.skill.type === 'library').map(skill => skill.skill) ?? []}
                            toggleSkill={async (id) => {
                                await toggleSkillMutation.mutateAsync({ id, primary: false })
                            }}
                            addSkill={async (name) => {
                                await addSkillMutation.mutateAsync({ name, type: 'library', primary: false })
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='bg-black border-white border rounded border-opacity-10'>
                <div className='flex p-4 space-y-4 bg-white bg-opacity-5'>
                    <div className='w-[250px] shrink-0'>
                        <div className='text-sm'>Other Frameworks</div>
                        <div className='text-sm opacity-60'>Add any frameworks you know here such as Next.js, Gatsby, etc.</div>
                    </div>

                    <div className='flex-1'>
                        <SkillList
                            allSkills={skillsQuery.data?.map(skill => skill.skill) ?? []}
                            skills={skillsQuery.data?.filter(skill => !skill.primary && skill.skill.type === 'framework').map(skill => skill.skill) ?? []}
                            toggleSkill={async (id) => {
                                await toggleSkillMutation.mutateAsync({ id, primary: false })
                            }}
                            addSkill={async (name) => {
                                await addSkillMutation.mutateAsync({ name, type: 'framework', primary: false })
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='bg-black border-white border rounded border-opacity-10'>
                <div className='flex p-4 space-y-4 bg-white bg-opacity-5'>
                    <div className='w-[250px] shrink-0'>
                        <div className='text-sm'>Other Tools</div>
                        <div className='text-sm opacity-60'>Add any tools you use such as Docker, AWS, Github, Visual Studio Code, etc.</div>
                    </div>

                    <div className='flex-1'>
                        <SkillList
                            allSkills={skillsQuery.data?.map(skill => skill.skill) ?? []}
                            skills={skillsQuery.data?.filter(skill => !skill.primary && skill.skill.type === 'tool').map(skill => skill.skill) ?? []}
                            toggleSkill={async (id) => {
                                await toggleSkillMutation.mutateAsync({ id, primary: false })
                            }}
                            addSkill={async (name) => {
                                await addSkillMutation.mutateAsync({ name, type: 'tool', primary: false })
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Skills
