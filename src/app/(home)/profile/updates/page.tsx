'use client'

import { UpdateType } from '@prisma/client'
import React, { useState } from 'react'
import { api } from '~/trpc/react'

const NewUpdate = ({ refetch }: { refetch: () => void }) => {
  const projectQuery = api.post.fetchProjects.useQuery()
  const [projectId, setProjectId] = useState<number | undefined>()
  const [updateType, setUpdateType] = useState<UpdateType | undefined>()
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const addUpdateMutation = api.post.addUpdate.useMutation({
    onSuccess: () => {
      setProjectId(undefined)
      setUpdateType(undefined)
      setTitle('')
      setContent('')
      refetch()
    }
  })

  function handleClickPost() {
    if (!title || !updateType) return

    addUpdateMutation.mutate({
      projectId,
      type: updateType,
      title,
      content
    })
  }

  return (
    <div>
      <h1 className='text-lg font-mono'>New Update</h1>

      <div className='space-y-4'>
        <div>
          <div className='font-bold text-sm opacity-80'>Project</div>
          <select className='bg-transparent border' value={projectId ?? ''} onChange={(e) => setProjectId(Number(e.target.value))}>
            <option value=''>Select one</option>
            {projectQuery.data?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      
        <div>
          <div className='font-bold text-sm opacity-80'>Update Type</div>
          <select className='bg-transparent border' value={updateType ?? ''} onChange={(e) => setUpdateType(e.target.value as UpdateType)}>
            <option value=''>Select one</option>
            <option value={UpdateType.FEATURE}>New Feature</option>
            <option value={UpdateType.PROGRESS}>Progress Update</option>
          </select>
        </div>

        <div>
          <div className='font-bold text-sm opacity-80'>Title</div>
          <input type='text' className='bg-transparent border' placeholder='' value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <div className='font-bold text-sm opacity-80'>Content</div>
          <textarea className='bg-transparent border' placeholder='' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
      </div>
      <div className='flex items-start'>
        <div className='bg-white rounded cursor-pointer text-black px-2' onClick={handleClickPost}>
          Post
        </div>
      </div>
    </div>
  )
}

const Updates = () => {
  const updatesQuery = api.post.fetchUpdates.useQuery()
  return (
    <div>
      <NewUpdate refetch={() => updatesQuery.refetch()} />

      {updatesQuery.data?.map((update) => (
        <div key={update.id}>
          <h1>{update.title}</h1>
          <p>{update.type}</p>
          <p>{update.content}</p>
          <div>{update.project.name}</div>
        </div>
      ))}
    </div>
  )
}

export default Updates
