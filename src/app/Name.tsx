'use client'

import React, { useState } from 'react'
import className from 'classnames'

import { api } from "~/trpc/react";

const Name = ({ initialName }: { initialName?: string }) => {
    const [name, setName] = useState(initialName)
    const [initial, setInitial] = useState(initialName)
    const canSave = name !== initial
    const updateNameMutation = api.post.updateName.useMutation()
    return (
        <div className='border-b border-[#1C2432] py-16 px-8'>
          <div className='grid grid-cols-3 space-x-10'>
            <div className='flex flex-col items-start'>
              <div className='font-medium mb-1'>Name</div>
              <div className='text-sm mb-6 text-gray-400'>Enter your full name, or a display name you would like to use.</div>
            </div>
            <div className='flex flex-col items-start'>
              <input 
                type='text' 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className='bg-white/5 border-white/10 text-sm border rounded p-2 w-60 mb-8'
              />
              <div
                onClick={async () => {
                    if (canSave && name) {
                        await updateNameMutation.mutateAsync(name)
                        setInitial(name)
                    }
                }}
                className={className('px-2 h-8 flex items-center text-sm rounded w-auto', (canSave || updateNameMutation.isLoading) ? 'bg-white text-black cursor-pointer' : 'bg-gray-600 bg-opacity-20 border border-white border-opacity-5 text-white text-opacity-20')}>
                {updateNameMutation.isLoading ? 'Saving...' : 'Save'}
              </div>
            </div>
          </div>
        </div>
    )
}

export default Name
