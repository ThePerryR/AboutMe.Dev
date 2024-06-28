'use client'

import React from 'react'
import GitHubCalendar from 'react-github-calendar'

const Calendar = ({ username }: { username: string }) => {
    return (
        <GitHubCalendar
            username={username}
            eventHandlers={{
                // onClick: (event) => (activity) => { console.log(activity) }
            }}
            fontSize={13}
            hideColorLegend
            theme={{
              dark: ['#172134', '#133c87', '#1e56c2', '#1075c8', '#008cff'],
            }}
        />
    )
}

export default Calendar
