'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { set } from 'zod'

import { UploadButton } from '~/utils/uploadthing'
import UploadButtonWrapper from './_components/upload-button'
import { api } from '~/trpc/react'



const ProfilePicture = ({ initialImage, emoji }: { initialImage?: string, emoji: string }) => {
    const [image, setImage] = useState(initialImage)
    const [uploadError, setUploadError] = useState<string | undefined>(undefined)
    const clearProfilePictureMutation = api.post.clearProfilePicture.useMutation()
    // rotation between -20 and 20
    const randomRotation = Math.floor(Math.random() * 40) - 20
    return (
        <div className='bg-white bg-opacity-5 border-white border rounded border-opacity-10'>
            <div className='flex p-4 space-x-10'>
                <div className='flex flex-col items-start'>
                    <div className='text-xl font-medium mb-5'>Avatar</div>
                    <div className='opacity-80 mb-6'>An avatar is a visual representation of you. It should be a square image that is at least 200x200 pixels.</div>
                    <UploadButton
                        endpoint="imageUploader"
                        className=''
                        appearance={{
                            button: (args) => `bg-white text-black h-6 text-sm px-2 w-auto`
                        }}
                        onUploadBegin={() => {
                            setUploadError(undefined)
                            
                        }}
                        onClientUploadComplete={(res) => {
                            setImage(res[0]?.url)
                        }}
                        onUploadError={(error: Error) => {
                            setUploadError('Invalid image. Max size is 4MB')
                        }}
                    />
                    {uploadError !== undefined &&
                    <div className='bg-red-500 bg-opacity-5 border-red-500 border-opacity-10 border rounded p-2 text-red-500'>
                        {uploadError}
                    </div>
                    }
                </div>
                <div>
                    <div className='w-[120px] h-[120px] relative'>
                        {image !== undefined
                            ? (
                                <Image src={image} alt='avatar' width={120} height={120} className='rounded w-full h-full object-cover' />
                            )
                            : (
                                <div className='w-[120px] h-[120px] bg-gray-500 rounded relative overflow-hidden'>
                                    <div className={`absolute text-[96px] top-[50%] left-[50%] `} style={{ transform: `rotate(${randomRotation}deg) translate(-50%, -50%)` }}>
                                        {emoji}
                                    </div>
                                </div>
                            )
                        }
                        {image !== undefined &&
                        <div onClick={() => clearProfilePictureMutation.mutate()} className='cursor-pointer text-red-400 hover:text-red-500 font-medium text-sm'>
                            Clear
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePicture
