'use client'

import React from 'react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import * as Select from '@radix-ui/react-select';
import { string } from 'zod';
import { api } from '~/trpc/react';
import classNames from 'classnames';

const Statuses = ({ initialNationality, initialStatus }: { initialNationality: string | null, initialStatus?: string | null }) => {
    const [nationality, setNationality] = React.useState(initialNationality ?? undefined);
    const [status, setStatus] = React.useState(initialStatus ?? undefined);
    const updateStatusesMutation = api.post.updateStatuses.useMutation();
    return (
        <div className='bg-white bg-opacity-5 border-white border rounded border-opacity-10'>
            <div className='flex p-4 space-x-4'>
                <div className='flex flex-col items-start'>
                    <div className='text-xl font-medium'>Statuses</div>
                </div>

                <div className='flex flex-wrap space-x-8 flex-1'>
                    <div className='flex items-center space-x-3'>
                        <div className='font-medium opacity-60'>Flair</div>
                        <div className='flex items-center'>
                            <EmojiPicker
                                emoji={status}
                                placeholder='😴'
                                onUpdate={(emoji) => {
                                    setStatus(emoji);
                                    updateStatusesMutation.mutate({
                                        statusEmoji: emoji
                                    })
                                }}
                            />
                            {status !== undefined &&
                            <div
                                onClick={() => {
                                    setStatus(undefined);
                                    updateStatusesMutation.mutate({
                                        statusEmoji: null
                                    })
                                }}
                                className='w-4 h-4 ml-1 hover:text-opacity-80 hover:bg-opacity-40 flex items-center justify-center rounded-full cursor-pointer text-xs bg-white bg-opacity-20 text-white text-opacity-50'>
                                x
                            </div>
                            }
                        </div>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <div className='font-medium opacity-60'>Flag</div>
                        <EmojiPicker
                            emoji={nationality}
                            placeholder='🇺🇸'
                            onUpdate={(emoji) => {
                                setNationality(emoji);
                                updateStatusesMutation.mutate({
                                    nationalityEmoji: emoji
                                })
                            }}
                        />
                        {nationality !== undefined &&
                        <div
                            onClick={() => {
                                setNationality(undefined);
                                updateStatusesMutation.mutate({
                                    nationalityEmoji: null
                                })
                            }}
                            className='w-4 h-4 ml-1 hover:text-opacity-80 hover:bg-opacity-40 flex items-center justify-center rounded-full cursor-pointer text-xs bg-white bg-opacity-20 text-white text-opacity-50'>
                            x
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const EmojiPicker = ({ emoji, placeholder, onUpdate }: { emoji: string | undefined, placeholder: string, onUpdate: (emoji: string) => void }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <div className='relative flex'>
            <div
                onClick={() => { setOpen(!open) }}
                className={classNames('bg-white py-1 px-2 rounded bg-opacity-20 hover:bg-opacity-50 cursor-pointer', emoji ? '' : 'opacity-50 hover:opacity-80')}>
                {emoji ?? <span className='opacity-40'>{placeholder}</span>}
            </div>
            {open &&
                <div className='absolute top-full left-50 transform -translate-x-1/2 z-10'>
                    <Picker
                        data={data}
                        onEmojiSelect={({ native }: { native: string }) => {
                            onUpdate(native);
                            setOpen(false);
                        }}
                    />
                </div>
            }
        </div>
    )
}

export default Statuses
