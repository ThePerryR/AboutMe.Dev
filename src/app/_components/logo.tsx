import Image from 'next/image'
import React from 'react'

export default function Logo() {
    const randomNumber = Math.floor(Math.random() * 11) + 1
    return (
        <div className='flex items-center space-x-2'>
            <Image src={`/emojis/${randomNumber}.png`} alt="AboutMe.dev" width={24} height={24} />
            <span className='text-sm font-mono'>aboutme.dev</span>
        </div>
    )
}