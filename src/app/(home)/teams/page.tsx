'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { api } from '~/trpc/react'

const Teams = () => {
  const teamsQuery = api.post.getTeams.useQuery()
  const createTeamMutation = api.post.createTeam.useMutation({
    onSuccess: () => {
      void teamsQuery.refetch()
    }
  })
  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
          <h1 className=' font-bold'>Teams</h1>
          <button className='text-black bg-white text-sm rounded-lg px-2 py-1' onClick={() => { createTeamMutation.mutate() }}>
              {createTeamMutation.isLoading ? 'One moment...' : 'Create Team'}
          </button>
      </div>
      {teamsQuery.isSuccess && !teamsQuery.data.length &&
      <div className='border-dashed border rounded border-opacity-40 p-4 text-center opacity-50'>
        <div>You are not a member of any teams yet.</div>
        <div>Create a team or ask someone to invite you to their team.</div>
      </div>
      }
      {teamsQuery.isSuccess && teamsQuery.data.map(team => (
        <Link key={team.id} href={`/teams/${team.id}`}>
          <div className='border border-opacity-20 rounded p-4 mb-4 cursor-pointer'>
            <div className='mb-2'>{team.name ?? 'Unnamed Team'}</div>
            <div>
              <div>
                <div className='text-xs font-bold mb-1'>Members</div>
                <div className='flex space-x-[-4px]'>
                  {team.users.map(user => (
                    <div key={user.id}>
                      {user.user.image &&
                      <Image className='w-6 h-6 rounded-full' src={user.user.image} width={40} height={40} alt={user.user.name ?? ''} />
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
        ))}
    </div>
  )
}

export default Teams
