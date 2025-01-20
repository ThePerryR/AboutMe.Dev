'use client'

import { Visibility } from '@prisma/client'
import React, { useState } from 'react'
import { api } from '~/trpc/react'

const Visiblity = ({ profileVisibility }: { profileVisibility: Visibility }) => {
  const [visibility, setVisibility] = useState(profileVisibility)

  const updateProfileVisibilityMutation = api.post.updateVisibility.useMutation()

  function handleChangeVisibility(e: React.ChangeEvent<HTMLSelectElement>) {
    setVisibility(e.target.value as Visibility)
    updateProfileVisibilityMutation.mutate({ profileVisibility: e.target.value as Visibility })
  }

  return (
    <div className='border-b border-[#1C2432] py-16 px-8 grid grid-cols-3 space-x-10'>
      <div className='flex flex-col items-start shrink-0'>
        <div className='font-medium mb-1'>Visibility</div>
      </div>
      <div className='flex flex-col items-start col-span-2'>
        <div className='text-sm font-medium mb-2'>Profile Visibility</div>
        <select value={visibility} onChange={handleChangeVisibility} className='bg-white/5 border-white/10 text-sm border rounded border-opacity-10 p-2 w-60'>
          <option value={Visibility.PUBLIC}>Public</option>
          <option value={Visibility.LINK}>Only with the link (will not show up in google and will not be searchable)</option>
          <option value={Visibility.PRIVATE}>Private</option>
        </select>
      </div>
    </div>
  )
}

export default Visiblity
