import React from 'react'
import Main from './Main'

const TeamDetails = ({ params }: { params: { id: string } }) => {
  return (
    <Main teamId={Number(params.id)} />
  )
}

export default TeamDetails
