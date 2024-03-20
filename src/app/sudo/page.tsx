import { Interest } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getServerAuthSession } from '~/server/auth'

import { api } from '~/trpc/react'
import { UploadButton } from '~/utils/uploadthing'
import Main from './Main'

const SudoPage = async () => {
    const session = await getServerAuthSession()
    if (!session?.user.isSuperUser) {
        return null
    }
    return (
        <Main />
    )
}



export default SudoPage

