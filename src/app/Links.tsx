'use client'

import React, { useState } from 'react'
import className from 'classnames'

import { api } from "~/trpc/react";

const Links = ({ username, initialTwitter, initialLinkedin }: { username: string, initialTwitter?: string, initialLinkedin?: string }) => {
    const [twitter, setTwitter] = useState(initialTwitter)
    const [linkedin, setLinkedin] = useState(initialLinkedin)
    const canSave = twitter !== initialTwitter || linkedin !== initialLinkedin
    const updateLinksMutation = api.post.updateLinks.useMutation()
    return (
        <div className='bg-black border-white border rounded border-opacity-10'>
            <div className='flex flex-col p-4 space-y-8 bg-white bg-opacity-5'>
                <div className='flex flex-col items-start'>
                    <div className='text-xl font-medium mb-3'>Github Username</div>
                    <input type='text' disabled value={`${username}`} className='bg-transparent border-white border rounded border-opacity-5 text-opacity-20 text-white p-2 max-w-96 w-full' />
                </div>
                <div className='flex flex-col items-start'>
                    <div className='text-xl font-medium mb-3'>X/Twitter</div>
                    <div className='border-white border rounded border-opacity-5 text-opacity-20 text-white p-2 max-w-96 w-full flex items-center'>
                        <div>x.com/</div>
                        <input type='text' placeholder='elonmusk' value={twitter} onChange={(e) => setTwitter(e.target.value)} className='bg-transparent placeholder:opacity-50 border-none flex-1 h-full focus:outline-none text-opacity-80 text-white' />
                    </div>
                </div>
                <div className='flex flex-col items-start'>
                    <div className='text-xl font-medium mb-3'>Linkedin</div>
                    <div className='border-white border rounded border-opacity-5 text-opacity-20 text-white p-2 max-w-96 w-full flex items-center'>
                        <div>linkedin.com/in/</div>
                        <input type='text' placeholder='JeffBezos123' value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className='bg-transparent placeholder:opacity-50 border-none flex-1 h-full focus:outline-none text-opacity-80 text-white' />
                    </div>
                </div>
            </div>
            <div className='flex p-4 justify-end'>
                <div
                    onClick={async () => {
                        if (canSave) {
                            updateLinksMutation.mutate({ twitterUsername: twitter, linkedinUsername: linkedin })
                        }
                    }}
                    className={className('px-2 h-8 flex items-center text-sm rounded w-auto', (canSave || updateLinksMutation.isLoading) ? 'bg-white text-black cursor-pointer' : 'bg-gray-600 bg-opacity-20 border border-white border-opacity-5 text-white text-opacity-20')}>
                    {updateLinksMutation.isLoading ? 'Saving...' : 'Save'}
                </div>
            </div>
        </div>
    )
}

export default Links
