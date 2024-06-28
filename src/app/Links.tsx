'use client'

import React, { useState } from 'react'
import className from 'classnames'
import * as Tooltip from '@radix-ui/react-tooltip';

import { api } from "~/trpc/react";
/*
profile status is
- public
- only by link
- private
*/

const Links = ({ username, initialTwitter, initialLinkedin, initialWebsite }: { username: string, initialTwitter?: string, initialLinkedin?: string, initialWebsite?: string }) => {
    const [twitter, setTwitter] = useState(initialTwitter)
    const [linkedin, setLinkedin] = useState(initialLinkedin)
    const [website, setWebsite] = useState(initialWebsite)
    const [initTwitter, setInitTwitter] = useState(initialTwitter)
    const [initLinkedin, setInitLinkedin] = useState(initialLinkedin)
    const [initWebsite, setInitWebsite] = useState(initialWebsite)
    const canSave = twitter !== initTwitter || linkedin !== initLinkedin || website !== initWebsite
    const updateLinksMutation = api.post.updateLinks.useMutation()
    return (
        <div className='border-b border-[#1C2432] py-16 px-8 grid grid-cols-3 space-x-10'>
            <div className='flex flex-col items-start shrink-0'>
              <div className='font-medium mb-1'>Links</div>
            </div>
            <div className='flex flex-col items-start space-y-8 col-span-2'>
                <div className='flex flex-col items-start'>
                    <div className='text-sm font-medium mb-2'>Github Username</div>
                    <Tooltip.Provider delayDuration={300}>
                      <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                          <input type='text' disabled value={`${username}`} className='bg-transparent cursor-not-allowed border-white border rounded border-opacity-5 text-opacity-20 text-white p-2 max-w-96 w-full' />

                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                              <Tooltip.Content
                                  className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-black text-opacity-80 select-none rounded-[4px] bg-white px-[10px] py-[6px] text-[13px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                  sideOffset={5}>
                                  You cannot change your Github username.
                                  <Tooltip.Arrow className="fill-white" />
                              </Tooltip.Content>
                          </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                </div>
                <div className='flex flex-col items-start'>
                    <div className='text-sm font-medium mb-2'>Personal Website/Portfolio</div>
                    <input type='text' placeholder='https://www.mysite.io' value={website} onChange={(e) => setWebsite(e.target.value)} className='bg-white/5 border-white/10 text-sm border rounded border-opacity-5 p-2 max-w-96 w-full placeholder:opacity-50 flex-1 h-full focus:outline-none text-opacity-80 text-white' />
                </div>
                <div className='flex flex-col items-start'>
                    <div className='text-sm font-medium mb-2'>X/Twitter</div>
                    <div className='bg-white/5 border-white/10 text-sm border rounded text-opacity-20 text-white p-2 max-w-96 w-full flex items-center'>
                        <div>x.com/</div>
                        <input type='text' placeholder='elonmusk' value={twitter} onChange={(e) => setTwitter(e.target.value)} className='bg-transparent placeholder:opacity-50 border-none flex-1 h-full focus:outline-none text-opacity-80 text-white' />
                    </div>
                </div>
                <div className='flex flex-col items-start'>
                    <div className='text-sm font-medium mb-2'>Linkedin</div>
                    <div className='bg-white/5 border-white/10 text-sm border rounded text-opacity-20 text-white p-2 max-w-96 w-full flex items-center'>
                        <div>linkedin.com/in/</div>
                        <input type='text' placeholder='JeffBezos123' value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className='bg-transparent placeholder:opacity-50 border-none flex-1 h-full focus:outline-none text-opacity-80 text-white' />
                    </div>
                </div>
                <div
                    onClick={async () => {
                        if (canSave) {
                            await updateLinksMutation.mutateAsync({
                                twitterUsername: twitter,
                                linkedinUsername: linkedin,
                                website
                            })
                            setInitTwitter(twitter)
                            setInitLinkedin(linkedin)
                            setInitWebsite(website)
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
