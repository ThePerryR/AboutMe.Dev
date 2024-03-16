'use client'

import React from 'react'
import GitHubCalendar from 'react-github-calendar'

const Calendar = ({ username }: { username: string }) => {
    return (
        <GitHubCalendar
            username={username}
            eventHandlers={{
                onClick: (event) => (activity) => { console.log(activity) }
            }}
            fontSize={13}
            hideColorLegend
        />
    )
}

export default Calendar
