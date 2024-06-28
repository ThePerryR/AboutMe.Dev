'use client'

import React, { useState } from 'react'
import className from 'classnames'

import { api } from "~/trpc/react";

const Location = ({ initialRegion, initialLocation }: { initialRegion?: string, initialLocation?: string }) => {
    const [region, setRegion] = useState(initialRegion)
    const [location, setLocation] = useState(initialLocation)
    const [initRegion, setInitRegion] = useState(initialRegion)
    const [initLocation, setInitLocation] = useState(initialLocation)
    const canSave = region !== initRegion || location !== initLocation
    const updateLocationMutation = api.post.updateLocation.useMutation()
    return (
        <div className='border-b border-[#1C2432] py-16 px-8'>
          <div className='grid grid-cols-3 space-x-10 w-full'>
              <div className='flex flex-col items-start'>
                <div className='font-medium mb-1'>Location</div>
              </div>
              <div className='flex flex-col items-start w-full space-y-10 col-span-2'>
                  <div className='flex flex-col items-start'>
                      <div className='text-sm font-medium mb-2'>Region</div>
                      <select
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          className='bg-white/5 border-white/10 text-sm border rounded border-opacity-10 p-2 w-60'>
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
                  <div className='flex flex-col items-start w-full'>
                      <div className='text-sm font-medium mb-1'>Location</div>
                      <div className='text-sm text-gray-400 mb-2'>Enter your city, state, country, or a general location</div>
                      <input
                          type='text' placeholder='"Greater St. Louis Area" or "Toledo, OH"' value={location} onChange={(e) => setLocation(e.target.value)}
                          className='w-full bg-white/5 border-white/10 text-sm border rounded p-2 max-w-80'
                      />
                  </div>
                  <div
                      onClick={async () => {
                          if (canSave) {
                              await updateLocationMutation.mutateAsync({ region, location })
                              setInitRegion(region)
                              setInitLocation(location)
                          }
                      }}
                      className={className('px-2 h-8 flex items-center text-sm rounded w-auto', (canSave || updateLocationMutation.isLoading) ? 'bg-white text-black cursor-pointer' : 'bg-gray-600 bg-opacity-20 border border-white border-opacity-5 text-white text-opacity-20')}>
                      {updateLocationMutation.isLoading ? 'Saving...' : 'Save'}
                  </div>
              </div>
            </div>
        </div>
    )
}

export default Location
