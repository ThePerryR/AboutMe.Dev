'use client'

import React, { useState } from 'react'
import className from 'classnames'

import { api } from "~/trpc/react";

const Location = ({ initialRegion, initialLocation }: { initialRegion?: string, initialLocation?: string }) => {
    const [region, setRegion] = useState(initialRegion)
    const [location, setLocation] = useState(initialLocation)
    const canSave = region !== initialRegion || location !== initialLocation
    const updateLocationMutation = api.post.updateLocation.useMutation()
    return (
        <div className='bg-black border-white border rounded border-opacity-10'>
            <div className='flex flex-col p-4 space-y-10 bg-white bg-opacity-5'>
                <div className='flex flex-col items-start'>
                    <div className='text-xl font-medium mb-5'>Region</div>
                    <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className='bg-transparent border-white border rounded border-opacity-10 p-2 w-60'>
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
                <div className='flex flex-col items-start'>
                    <div className='text-xl font-medium mb-5'>Location</div>
                    <div className='opacity-80 mb-6'>Enter your city, state, country, or a general location</div>
                    <input
                        type='text' placeholder='"Greater St. Louis Area" or "Toledo, OH"' value={location} onChange={(e) => setLocation(e.target.value)}
                        className='bg-transparent border-white border rounded border-opacity-10 p-2 max-w-80 w-full'
                    />
                </div>
            </div>
            <div className='flex p-4 justify-end'>
                <div
                    onClick={async () => {
                        if (canSave) {
                            updateLocationMutation.mutate({ region, location })
                        }
                    }}
                    className={className('px-2 h-8 flex items-center text-sm rounded w-auto', (canSave || updateLocationMutation.isLoading) ? 'bg-white text-black cursor-pointer' : 'bg-gray-600 bg-opacity-20 border border-white border-opacity-5 text-white text-opacity-20')}>
                    {updateLocationMutation.isLoading ? 'Saving...' : 'Save'}
                </div>
            </div>
        </div>
    )
}

export default Location
