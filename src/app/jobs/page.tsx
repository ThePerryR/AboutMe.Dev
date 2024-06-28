'use client'

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import { LinkIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { api } from '~/trpc/react';
import SkillList from '../(home)/profile/skills/SkillList';
import { type Skill } from '@prisma/client';


const LinkForm = () => {
  const [url, setUrl] = React.useState('')
  const [companyName, setCompanyName] = React.useState('')
  const [jobTitle, setJobTitle] = React.useState('')
  const [region, setRegion] = React.useState('us')
  const [location, setLocation] = React.useState('')
  const [allowRemote, setAllowRemote] = React.useState(false)
  const [salaryMin, setSalaryMin] = React.useState('')
  const [salaryMax, setSalaryMax] = React.useState('')
  const [aboutCompany, setAboutCompany] = React.useState('')
  const [aboutTeam, setAboutTeam] = React.useState('')
  const [selectedSkills, setSelectedSkills] = React.useState<Skill[]>([])

  const skillsQuery = api.post.searchSkills.useQuery({ search: '', exclude: selectedSkills.map(s => s.id) })
  const addSkillMutation = api.post.addSkill.useMutation({
    onSuccess: (skill) => {
      setSelectedSkills([...selectedSkills, skill])
    }
  })
  return (
    <div className='space-y-3 text-white'>
      <div className='w-full'>
        <div className='font-medium mb-1'>Link</div>
        <input
          className="bg-white/5 border-white/10 w-full text-sm border rounded p-2"
          type="text"
          placeholder="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={async () => {
            try {
              // no-cors
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'text/html',
                }
              });
              const html = await response.text()
              console.log(html, 'html')
            } catch (err) {
              console.log(err, 'errrerer')
            }
          }}
        />
      </div>
      <div>
        <div className='font-medium mb-1'>Company Name</div>
        <input
          className="bg-white/5 border-white/10 w-full text-sm border rounded p-2"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      <div>
        <div className='font-medium mb-1'>Job Title</div>
        <input
          className="bg-white/5 border-white/10 w-full text-sm border rounded p-2"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>
      <div>
        <div className='font-medium mb-1'>Region</div>
        <select
          className="bg-white/5 border-white/10 w-full text-sm border rounded p-2"
          value={region}
          onChange={(e) => setRegion(e.target.value)}>
          <option value=''>Select Region</option>
          <option value='us'>United States</option>
          <option value='ca'>Canada</option>
          <option value='sa'>Latin America & Caribbean</option>
          <option value='eu'>Europe</option>
          <option value='ap'>Asia Pacific</option>
          <option value='me'>Middle East & Africa</option>
          <option value='oc'>Oceania</option>
          <option value='other'>Other</option>
        </select>
      </div>
      <div>
        <div className='font-medium mb-1'>Location</div>
        <input
          className="bg-white/5 border-white/10 w-full text-sm border rounded p-2"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className='flex items-center'>
        <input
          type='checkbox'
          className='mr-1'
          checked={allowRemote}
          onChange={(e) => setAllowRemote(e.target.checked)}
        />
        <div className='font-medium text-sm'>Allows Remote</div>
      </div>
      <div>
        <div className='font-medium mb-1'>Salary</div>
        <div className='flex space-x-8'>
          <div className='flex items-center space-x-2'>
            <div className='text-sm font-medium'>Min</div>
            <input
              className="bg-white/5 border-white/10 w-full text-sm border rounded p-2"
              type="number"
              value={salaryMin}
              min={0}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>
          <div className='flex items-center space-x-2'>
            <div className='text-sm font-medium'>Max</div>
            <input
              className="bg-white/5 border-white/10 w-full text-sm border rounded p-2"
              type="number"
              min={salaryMin ?? 0}
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <div className='font-medium mb-1'>Skills</div>
        <SkillList
          primary
          allSkills={skillsQuery.data ?? []}
          skills={selectedSkills}
          toggleSkill={async (id: number) => {
            const skill = skillsQuery.data?.find(s => s.id === id)
            if (skill) {
              if (selectedSkills.find(s => s.id === id)) {
                setSelectedSkills(selectedSkills.filter(s => s.id !== id))
              } else {
                setSelectedSkills([...selectedSkills, skill])
              }
            }
          }}
          addSkill={async (name) => {
            addSkillMutation.mutate({ type: 'language', name })
          }}
        />
      </div>
    </div>
  )
}
const Jobs = () => {
  const [type, setType] = React.useState<'link' | 'post'>('link')
  return (
    <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="bg-white rounded text-black py-1 px-4">
        Add Job
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="text-white data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] overflow-auto translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#202835] focus:outline-none">
        <div className='bg-[#353c48] flex px-6 py-2'>
          <Dialog.Title className="text-mauve12 m-0 text-[17px] text-sm uppercase font-medium">
            Add Job
          </Dialog.Title>
        </div>
        <div className='p-6'>
          <div className='mb-6 flex space-x-4'>
            <div onClick={() => setType('post')} className={classNames('flex-1 border rounded flex items-center justify-center py-2 cursor-pointer', type === 'post' ? 'border-blue-400 bg-blue-50 text-blue-500' : '')}>
              <LinkIcon className={classNames('w-4 h-4 fill-gray-500 mr-1', type === 'post' ? 'fill-blue-500' : '')} />  Create Job Post
            </div>
            <div onClick={() => setType('link')} className={classNames('flex-1 border rounded flex items-center justify-center py-2 cursor-pointer', type === 'link' ? 'border-blue-400 bg-blue-50 text-blue-500' : '')}>
              <LinkIcon className={classNames('w-4 h-4 fill-gray-500 mr-1', type === 'link' ? 'fill-blue-500' : '')} />  Link to URL
            </div>
          </div>
          {type === 'link' &&
          <LinkForm />
          }
        </div>
        <div className="mt-[25px] flex justify-end">
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close">
              <div>Close</div>
            </button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <button className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
              Save changes
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  )
}

export default Jobs
