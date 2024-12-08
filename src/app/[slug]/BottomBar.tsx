'use client'

import Link from 'next/link'
import React from 'react'

const BottomBar = ({ username }: { username: string }) => {
  const [generatingResume, setGeneratingResume] = React.useState(false)
  return (
    <div className='flex justify-center hidden'>
      <div onClick={async () => {
        setGeneratingResume(true)
        const response = await fetch(`/api/resumes?username=${username}`)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${username}-resume.pdf`
        a.click()
        URL.revokeObjectURL(url)
        setGeneratingResume(false)
      }}>
        <button type='submit' className='text-sm opacity-70 font-medium mb-2 mt-10'>
            {generatingResume ? 'Generating Resume...' : 'Download Resume'}
        </button>
      </div>
    </div>
  )
}

export default BottomBar
