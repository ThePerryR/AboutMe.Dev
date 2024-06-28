'use client'

import React from 'react'
import { type Skill, type Project, type User, type UserProject } from '@prisma/client'
import classNames from 'classnames'
import Image from 'next/image'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tooltip from '@radix-ui/react-tooltip';

import { api } from '~/trpc/react'
import { UploadButton } from '~/utils/uploadthing'
import SkillList from '../profile/skills/SkillList'
import Link from 'next/link'


const Projects = () => {
    const [favoriteCount, setFavoriteCount] = React.useState(0)
    const projects = api.post.fetchProjects.useQuery(undefined, {
        onSuccess: (data) => {
            setFavoriteCount(data.filter((p) => p.isFavorited).length)
        }
    })
    const createProjectMutation = api.post.createProject.useMutation({
        onSuccess: () => {
            void projects.refetch()
        },
    })
    if (!projects.isSuccess) return <div>Loading...</div>
    return (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <h1 className=' font-bold'>Projects</h1>
                <button className='text-black bg-white text-sm rounded-lg px-2 py-1' onClick={() => createProjectMutation.mutate()}>
                  {createProjectMutation.isLoading ? 'One moment...' : 'Add Project'}
                </button>
            </div>
            {projects.data.length === 0
                ? (
                    <div className='bg-white bg-opacity-5 border-white border-opacity-10 border rounded-lg items-center py-20 border-dashed flex flex-col'>
                        <div className='text-sm opacity-60'>
                            {'No projects'}
                        </div>
                    </div>
                )
                : (
                    <div className='space-y-10'>
                        {projects.data.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                canFavorite={favoriteCount < 6}
                                toggleFavorite={() => {
                                    void projects.refetch()
                                }}
                                refresh={() => {
                                  void projects.refetch()
                                }}
                            />
                        ))}
                    </div>
                )}
        </div>
    )
}

const ProjectCard = ({ project, canFavorite, toggleFavorite, refresh }: { project: Project & { skills: Skill[], users: (UserProject & { user: User })[] }, canFavorite: boolean, toggleFavorite: () => void, refresh: () => void }) => {
    const [name, setName] = React.useState(project.name)
    const [url, setUrl] = React.useState(project.url)
    const [status, setStatus] = React.useState(project.status)
    const [headline, setHeadline] = React.useState(project.headline)
    const [description, setDescription] = React.useState(project.description)
    const [skills, setSkills] = React.useState(project.skills)
    const [newUserName, setNewUserName] = React.useState('')

    const [image, setImage] = React.useState(project.image)
    const [isFavorited, setIsFavorited] = React.useState(project.isFavorited)

    const canSave = name !== project.name || url !== project.url || status !== project.status || headline !== project.headline || image !== project.image || description !== project.description
    const updateProjectMutation = api.post.updateProject.useMutation({})
    const deleteProjectMutation = api.post.deleteProject.useMutation({
        onSuccess: () => {
            toggleFavorite()
        }
    })
    const toggleProjectFavoriteMutation = api.post.toggleProjectFavorite.useMutation({
        onSuccess: () => {
            toggleFavorite()
        }
    })
    const addSkillMutation = api.post.addSkill.useMutation({
        onSuccess: (skill) => {
            setSkills([...skills, skill])
        }
    })
    const toggleSkillMutation = api.post.toggleSkill.useMutation({
        onSuccess: (skills) => {
            console.log(111, skills)
            setSkills(skills)
        }
    })

    const addUserToProjectMutation = api.post.addUserToProject.useMutation({
        onSuccess: (user) => {
          refresh()
        }
    })
    function handleClickAddUser() {
      addUserToProjectMutation.mutate({ projectId: project.id, username: newUserName })
      setNewUserName('')
    }
    const removeUserFromProjectMutation = api.post.removeUserFromProject.useMutation({
      onSuccess: () => {
        refresh()
      }
    })
    return (
        <div className='bg-black border-white border rounded border-opacity-10'>
            <div key={project.id} className='flex flex-col p-4 space-y-4 bg-white bg-opacity-5'>
                <div className='flex'>
                    <div className='text-sm mb-1 w-[120px]'>Name</div>
                    <input
                        type='text'
                        value={name ?? ''}
                        onChange={(e) => setName(e.target.value)}
                        className='bg-transparent border-white border rounded border-opacity-10 p-2 w-full'
                    />
                </div>
                <div className='flex'>
                    <div className='text-sm mb-1 w-[120px]'>URL</div>
                    <input
                        type='text'
                        value={url ?? ''}
                        onChange={(e) => setUrl(e.target.value)}
                        className='bg-transparent border-white border rounded border-opacity-10 p-2 w-full'
                    />
                </div>
                <div className='flex'>
                    <div className='text-sm mb-1 w-[120px]'>Headline</div>
                    <input
                        type='text'
                        value={headline ?? ''}
                        placeholder='"Recipe app for busy people"'
                        onChange={(e) => setHeadline(e.target.value)}
                        className='bg-transparent placeholder:opacity-30 border-white border rounded border-opacity-10 p-2 w-full'
                    />
                </div>
                <div className='flex'>
                    <div className='text-sm mb-1 w-[120px]'>Description</div>
                    <textarea
                        value={description ?? ''}
                        placeholder='"Recipe app for busy people"'
                        onChange={(e) => setDescription(e.target.value)}
                        className='bg-transparent placeholder:opacity-30 border-white border rounded border-opacity-10 p-2 w-full'
                    />
                </div>
                {/* <div className='flex'>
                    <div className='text-sm mb-1 w-[120px]'>Description</div>
                    <textarea
                        value={description ?? ''}
                        onChange={(e) => setDescription(e.target.value)}
                        className='bg-transparent placeholder:opacity-30 border-white border rounded border-opacity-10 p-2 w-full'
                    />
                </div> */}
                <div className='flex'>
                    <div className='text-sm mb-1 w-[120px]'>Status</div>
                    <select
                        value={status ?? ''}
                        onChange={(e) => setStatus(e.target.value)}
                        className='bg-transparent border-white border rounded border-opacity-10 p-2 w-full'>
                        <option value=''>Select...</option>
                        <option value='idea'>Idea</option>
                        <option value='in-progress'>In Progress</option>
                        <option value='live-beta'>Live - Beta</option>
                        <option value='live'>Live</option>
                        <option value='paused'>Paused</option>
                        <option value='inactive'>Inactive</option>
                    </select>
                </div>
                <div className='flex'>
                    <div className='flex-1 flex flex-col items-start'>
                        <div className='text-sm mb-1'>Image</div>
                        <div className='text-xs opacity-60 mb-2'>Upload a cover image for your project. Recommended size is 1200x630</div>
                        <div>
                            <UploadButton
                                endpoint="projectImage"
                                input={{ projectId: project.id }}
                                className=''
                                appearance={{
                                    button: (args) => `bg-white text-black h-6 text-sm px-2 w-auto`
                                }}
                                onUploadBegin={() => {
                                    // setUploadError(undefined)
                                }}
                                onClientUploadComplete={(res) => {
                                    setImage(res[0]?.url ?? null)
                                }}
                                onUploadError={(error: Error) => {
                                    // setUploadError('Invalid image. Max size is 4MB')
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className='border-white border-opacity-10  h-[157.5px] w-[300px] rounded flex items-center border'>
                            {image !== null
                                ? (
                                    <Image
                                        src={image}
                                        width={300}
                                        height={157.5}
                                        alt='image preview'
                                        className='w-full h-full object-cover'
                                    />
                                )
                                : 'No images'
                            }
                        </div>
                    </div>
                </div>

                <div className='flex mb-8'>
                    <div className='flex-1 flex flex-col items-start max-w-[250px]'>
                        <div className='text-sm mb-1'>Skills</div>
                        <div className='text-xs opacity-60'>List the technologies and tools used in this project.</div>
                    </div>
                    <div className='flex-1'>
                        <SkillList
                            allSkills={skills}
                            skills={skills}
                            toggleSkill={async (id) => {
                                await toggleSkillMutation.mutateAsync({ id, projectId: project.id })
                            }}
                            addSkill={async (name) => {
                                await addSkillMutation.mutateAsync({ name, type: 'language', projectId: project.id })
                            }}
                        />
                    </div>
                </div>

                <div>
                  <div className='flex items-center justify-between'>
                    <div>Users</div>

                    <input 
                      className='border bg-transparent' 
                      placeholder='Add user by username'
                      value={newUserName} 
                      onChange={e => setNewUserName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleClickAddUser()
                        }
                      }}
                    />
                  </div>
                  <div>
                    {project.users.map(user => (
                      <div key={user.user.username} className='flex items-center space-x-4'>
                        <Link href={`/${user.user.username}`}>
                          <div>{user.user.name} {user.user.nationalityEmoji}</div>
                        </Link>
                        <div 
                          className='cursor-pointer text-xs text-red-500'
                          onClick={() => {
                            removeUserFromProjectMutation.mutate({ projectId: project.id, userId: user.user.id })
                          }}>
                          Remove</div>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
            <div className='flex p-4 justify-between items-center'>
                <Tooltip.Provider delayDuration={(!isFavorited && !canFavorite) ? 100 : 500}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <div
                                className={classNames('group', (!canFavorite && !isFavorited) ? 'cursor-not-allowed' : 'cursor-pointer', { 'opacity-50': (!canFavorite && !isFavorited) })}
                                onClick={() => {
                                    if (!isFavorited && !canFavorite) return
                                    toggleProjectFavoriteMutation.mutate(project.id)
                                    setIsFavorited(!isFavorited)
                                }}>
                                {isFavorited
                                    ? (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-6 h-6 group-hover:hidden text-blue-500">
                                                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                                            </svg>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-6 h-6 hidden group-hover:flex text-blue-500">
                                                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93ZM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 0 1 3.75 21Z" />
                                            </svg>

                                        </>
                                    )
                                    : (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className={classNames("w-6 h-6", canFavorite ? 'group-hover:hidden' : '')}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                            </svg>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className={classNames("hidden w-6 h-6", canFavorite ? 'group-hover:flex' : '')}>
                                                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                                            </svg>
                                        </>
                                    )
                                }
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content className='bg-white'>
                                <div className='text-xs p-2'>
                                    {isFavorited
                                        ? 'Unfavorite'
                                        : canFavorite
                                            ? 'Favorite'
                                            : 'You can only favorite 6 projects'
                                    }
                                </div>
                                <Tooltip.Arrow className='fill-white'/>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
                <div className='flex items-center'>
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
                                        if (confirm("Are you sure you want to delete this project?")) {
                                            deleteProjectMutation.mutate(project.id)
                                        }
                                    }}
                                    className='px-3 text-red-500 font-medium text-sm cursor-pointer hover:bg-gray-200 h-8 flex items-center'>
                                    <div>Delete Project</div>
                                </DropdownMenu.Item>
                                <DropdownMenu.Arrow className='fill-white' />
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    <div
                        onClick={async () => {
                            updateProjectMutation.mutate({
                                id: project.id,
                                name: name ?? undefined,
                                url: url ?? undefined,
                                status: status ?? undefined,
                                headline: headline ?? undefined,
                                description: description ?? undefined,
                            })
                        }}
                        className={classNames('px-2 h-8 flex items-center text-sm rounded w-auto', (canSave || updateProjectMutation.isLoading) ? 'bg-white text-black cursor-pointer' : 'bg-gray-600 bg-opacity-20 border border-white border-opacity-5 text-white text-opacity-20')}>
                        {updateProjectMutation.isLoading ? 'Saving...' : 'Save'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Projects
