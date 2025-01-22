'use client'

import React, { useEffect } from 'react'
import { init } from 'emoji-mart'
import data from '@emoji-mart/data'

const EmojiLoader = () => {
    useEffect(() => {
        void init({ data })
    }, [])
    return null
}

export default EmojiLoader
