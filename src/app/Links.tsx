/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import className from 'classnames'
import * as Tooltip from '@radix-ui/react-tooltip';

import { api } from "~/trpc/react";
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
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
                    <Tooltip.Provider delayDuration={120}>
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

                    
                    <Tooltip.Provider delayDuration={120}>
                      <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <div className='bg-blue-500/20 mt-2 border border-blue-500/50 rounded p-2 text-sm text-blue-500/80'>
                              Please ensure you are sharing &quot;Private Contributions&quot; in your Github settings.
                              <QuestionMarkCircleIcon className='w-4 h-4 inline ml-1' />
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                              <Tooltip.Content
                                  className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-black text-opacity-80 select-none rounded-[4px] bg-white px-[10px] py-[6px] text-[13px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                  sideOffset={5}>
                                  <div>
                                    <div className='text-base max-w-[480px]'>Go to your {username ? <a href={`https://github.com/${username}`} className='text-blue-500/80 underline'>profile page</a> : 'profile page'}, click on <b>Contribution Settings</b> and then activate the <b>Private contributions</b>. Check the <a href='https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/showing-your-private-contributions-and-achievements-on-your-profile' className='text-blue-500/80 underline'>official GitHub docs here.</a></div>
                                    <img 
                                      src='https://media.licdn.com/dms/image/v2/D4E12AQGURddsA284Gw/article-inline_image-shrink_1500_2232/article-inline_image-shrink_1500_2232/0/1711976465034?e=1743033600&v=beta&t=1f8k0810pRhfu3fKKYnxnO-6oC9PTTqXSj21jvhLdg8' 
                                      className='w-full max-w-[440px]' 
                                      alt='Github Contribution Settings'
                                    />
                                  </div>
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
