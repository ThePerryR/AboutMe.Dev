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
        <div className='bg-black border-white border rounded border-opacity-10'>
            <div className='flex p-4 space-x-10 bg-white bg-opacity-5'>
                <div className='flex flex-col items-start'>
                    <div className='text-xl font-medium mb-5'>Name</div>
                    <div className='opacity-80 mb-6'>Enter your full name, or a display name you would like to use.</div>
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} className='bg-transparent border-white border rounded border-opacity-10 p-2 w-60' />
                </div>
            </div>
            <div className='flex p-4 justify-end'>
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
    )
}

export default Name
