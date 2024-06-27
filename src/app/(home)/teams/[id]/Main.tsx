'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { api } from '~/trpc/react'
import { UploadButton } from '~/utils/uploadthing'

const StringEditor = ({ label, value, handleClickSave }: { label: string, value: string, handleClickSave: (newValue: string) => void }) => {
  const [localValue, setLocalValue] = React.useState(value)
  const [editing, setEditing] = React.useState(false)
  return (
    <div className='flex items-center justify-between'>
      <div>{label}</div>

      <div className='space-x-4 flex items-center'>
        {editing
          ? (
          <input
            value={localValue}
            onChange={e => setLocalValue(e.target.value)}
            className='border border-opacity-20 bg-transparent rounded p-1'
          />
          )
          : (
          <div>{localValue}</div>
          )
        }
        {!editing &&
          <button className='text-sm' onClick={() => setEditing(true)}>Edit</button>
        }
        {editing && 
        <button 
          className='text-sm'
          onClick={() => {
            handleClickSave(localValue)
            setEditing(false)
          }}>
          Save
        </button>
        }
        {editing && 
        <button 
          className='text-red-500 text-sm'
          onClick={() => {
            setEditing(false)
            setLocalValue(value)
          }}>
          Cancel
        </button>
        }
      </div>
    </div>
  )
}

const ImageEditor = ({ label, value, handleClickSave }: { label: string, value: string | undefined, handleClickSave: (newValue: string) => void }) => {
  const [localValue, setLocalValue] = React.useState<string | undefined>(value)
  const [editing, setEditing] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | undefined>(undefined)
  return (
    <div className='flex items-center justify-between'>
      <div>{label}</div>

      <div className='space-x-4 flex items-center'>
        {localValue && 
        <Image src={localValue} alt='avatar' width={64} height={64} className='rounded object-cover' />
        }
        {localValue === value
        ? (
        <UploadButton
          endpoint="logoUploader"
          className='shrink-0'
          appearance={{
              button: (args) => `bg-white text-black h-6 text-sm px-2 w-auto shrink-0`
          }}
          onUploadBegin={() => {
              setUploadError(undefined)
          }}
          onClientUploadComplete={(res) => {
              setLocalValue(res[0]?.url)
          }}
          onUploadError={(error: Error) => {
              setUploadError('Invalid image. Max size is 4MB')
          }}
        />
        )
        : (
          <div className='text-sm  flex flex-col space-y-4'>
            <button 
              onClick={() => {
                if (localValue) {
                  handleClickSave(localValue)
                }
              }}>
              Save
            </button>
            <button className='text-red-500' onClick={() => {
              setLocalValue(value)
            }}>Cancel</button>
          </div>
        )
        }
      </div>
    </div>
  )
}

const Main = ({ teamId }: { teamId: number }) => {
  const teamQuery = api.post.getTeam.useQuery(teamId)
  const [inviteUsername, setInviteUsername] = React.useState<string>('')
  const router = useRouter()
  const updateTeamMutation = api.post.updateTeam.useMutation({
    onSuccess: () => {
      void teamQuery.refetch()
    }
  })
  console.log(111, teamQuery.data)
  const deleteTeamMutation = api.post.deleteTeam.useMutation({
    onSuccess: () => {
      console.log('DELETED')
      void router.push('/teams')
    }
  })
  const addUserToTeamMutation = api.post.addUserToTeam.useMutation({
    onSuccess: () => {
      void teamQuery.refetch()
      setInviteUsername('')
    }
  })
  return (
    <div className='space-y-8'>
      {teamQuery.isSuccess && teamQuery.data &&
      <>
        <StringEditor
          label='Company Name'
          value={teamQuery.data.name ?? ''}
          handleClickSave={(value) => updateTeamMutation.mutate({ id: teamId, name: value })}
        />
        <ImageEditor
          label='Square Logo'
          value={teamQuery.data.image ?? ''}
          handleClickSave={(value) => updateTeamMutation.mutate({ id: teamId, image: value })}
        />
        <div>
          <div className='flex items-center justify-between mb-2'>
            <div>Members</div>

            <input 
              className='text-xs w-[220px] border rounded bg-transparent p-1' 
              placeholder='Add a GitHub username to your team' 
              value={inviteUsername}
              onChange={e => setInviteUsername(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  addUserToTeamMutation.mutate({ teamId, username: inviteUsername })
                }
              }}
            />
          </div>
          <div className='border divide rounded-lg'>
            {teamQuery.data.users.map(member => (
              <div key={member.user.id} className='flex items-center justify-between p-4'>
                <div>{member.user.name}</div>
                {member.owner && <div className='text-xs'>Owner</div>}
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col items-start'>
          <div 
            onClick={() => {
              deleteTeamMutation.mutate(teamId)
            }}
            className='px-2 cursor-pointer text-red-500 font-bold border border-red-500 rounded'>
            Delete Team
          </div>
        </div>
      </>
      }
    </div>
  )
}

export default Main
