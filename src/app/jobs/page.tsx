import React from 'react'
import Main from './Main'
import { getServerAuthSession } from '~/server/auth'

export type SessionUser = ({
  id: string;
  username: string;
  isSuperUser: boolean;
} & {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
}) | undefined
const JobsPage = async () => {
  const session = await getServerAuthSession()
  return (
    <Main user={session?.user} />
  )
}

export default JobsPage
