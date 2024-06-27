import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { api } from '~/trpc/server'

const ProjectPage = async ({ params }: { params: { id: string } }) => {
    const project = await api.post.fetchProject.query(Number(params.id))
    if (!project) return null
    console.log(project, 'PROJECT PAGEIO')
    return (
        <div className='text-white px-6'>
          <div className='flex space-x-8'>
            <div className='w-1/2'>
              {project.image &&
              <Image className='w-full mb-3 rounded' src={project.image} alt={project.name ?? ''} width={500} height={500} />
              }
              <div className='flex space-x-4 items-center'>
              <h1 className='font-bold text-2xl mb-2'>{project.name}</h1>
                {project.status === 'live' &&
                <div className='bg-green-500 text-black text-[12px] px-2 rounded-full'>Live</div>
                }
                {project.status === 'live-beta' &&
                <div className='bg-blue-500 text-black text-[12px] px-2 rounded-full'>Beta</div>
                }
                {project.status === 'in-progress' &&
                <div className='bg-yellow-500 text-black text-[12px] px-2 rounded-full'>In Progress</div>
                }
                {project.status === 'idea' &&
                <div className='bg-gray-500 text-black text-[12px] px-2 rounded-full'>Idea</div>
                }
                {project.status === 'paused' &&
                <div className='bg-gray-500 text-black text-[12px] px-2 rounded-full'>Paused</div>
                }
                {project.status === 'inactive' &&
                <div className='bg-gray-500 text-black text-[12px] px-2 rounded-full'>Inactive</div>
                }
              </div>
              <p className='opacity-60 mb-8'>{project.description}</p>
              <div className='flex space-x-4 items-center'>
                {project.url
                  ? (
                      <Link href={`/project/${project.id}`} target="_blank" className='flex items-center'>
                          <div className='text-sm opacity-80'>{project.url.includes('github.com') ? 'GitHub' : 'Website'}</div>
                          <div className='ml-1 opacity-40'>
                              {project.url.includes('github.com')
                                  ? (
                                      <svg width="33" height="32" className='h-[14px] w-[14px]' viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path fillRule="evenodd" clipRule="evenodd" d="M16.2847 0C7.27967 0 0 7.33333 0 16.4057C0 23.6577 4.66433 29.7963 11.135 31.969C11.944 32.1323 12.2403 31.616 12.2403 31.1817C12.2403 30.8013 12.2137 29.4977 12.2137 28.1393C7.68367 29.1173 6.74033 26.1837 6.74033 26.1837C6.01233 24.2823 4.93367 23.7937 4.93367 23.7937C3.451 22.7887 5.04167 22.7887 5.04167 22.7887C6.68633 22.8973 7.54933 24.4727 7.54933 24.4727C9.005 26.9713 11.3507 26.2653 12.2943 25.8307C12.429 24.7713 12.8607 24.038 13.319 23.6307C9.706 23.2503 5.90467 21.838 5.90467 15.5363C5.90467 13.7437 6.55133 12.277 7.576 11.1363C7.41433 10.729 6.848 9.04467 7.738 6.79033C7.738 6.79033 9.113 6.35567 12.2133 8.47433C13.5407 8.11522 14.9096 7.93254 16.2847 7.931C17.6597 7.931 19.0613 8.12133 20.3557 8.47433C23.4563 6.35567 24.8313 6.79033 24.8313 6.79033C25.7213 9.04467 25.1547 10.729 24.993 11.1363C26.0447 12.277 26.6647 13.7437 26.6647 15.5363C26.6647 21.838 22.8633 23.223 19.2233 23.6307C19.8167 24.1467 20.3287 25.1243 20.3287 26.6727C20.3287 28.8727 20.302 30.6383 20.302 31.1813C20.302 31.616 20.5987 32.1323 21.4073 31.9693C27.878 29.796 32.5423 23.6577 32.5423 16.4057C32.569 7.33333 25.2627 0 16.2847 0Z" fill="white" />
                                      </svg>
                                  )
                                  : (
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 text-white">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                      </svg>

                                  )
                              }
                          </div>
                      </Link>
                  )
                  :
                  <div className='text-sm opacity-100'>{project.name}</div>
                }
              </div>
            </div>

            <div className='w-1/2'>
              <h2 className='text-xl font-medium'>Project Details</h2>
              <p className='opacity-30 mb-10'>No details</p>

              <h2 className='text-xl font-medium mb-2'>Skills & Technologies Used</h2>
              {project.skills.length === 0
                ? <p className='opacity-30 mb-10'>No skills</p>
                : (
                  <div className='flex flex-wrap gap-12 mb-10'>
                    {project.skills.filter(skill => skill.type === 'language').length > 0 &&
                    <div>
                      <h3 className=' font-medium mb-1'>Languages</h3>
                      <ul className='flex flex-wrap gap-2'>
                        {project.skills.filter(skill => skill.type === 'language').map(skill => (
                          <li key={skill.id} className='flex items-center space-x-1'>
                            {skill.image &&
                            <Image className='rounded-full' src={skill.image} alt={skill.name ?? ''} width={20} height={20} />
                            }
                            <span className='opacity-70 text-sm'>{skill.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    }
                    {project.skills.filter(skill => skill.type === 'framework').length > 0 &&
                    <div>
                      <h3 className=' font-medium mb-1'>Frameworks</h3>
                      <ul className='flex flex-wrap gap-2'>
                        {project.skills.filter(skill => skill.type === 'framework').map(skill => (
                          <li key={skill.id} className='flex items-center space-x-1'>
                            {skill.image &&
                            <Image className='rounded-full' src={skill.image} alt={skill.name ?? ''} width={20} height={20} />
                            }
                            <span className='opacity-70 text-sm'>{skill.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    }
                    {project.skills.filter(skill => skill.type === 'library').length > 0 &&
                    <div>
                      <h3 className=' font-medium mb-1'>Libraries</h3>
                      <ul className='flex flex-wrap gap-2'>
                        {project.skills.filter(skill => skill.type === 'library').map(skill => (
                          <li key={skill.id} className='flex items-center space-x-1'>
                            {skill.image &&
                            <Image className='rounded-full' src={skill.image} alt={skill.name ?? ''} width={20} height={20} />
                            }
                            <span className='opacity-70 text-sm'>{skill.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    }
                    {project.skills.filter(skill => skill.type === 'tool').length > 0 &&
                    <div>
                      <h3 className=' font-medium mb-1'>Tools</h3>
                      <ul className='flex flex-wrap gap-2'>
                        {project.skills.filter(skill => skill.type === 'tool').map(skill => (
                          <li key={skill.id} className='flex items-center space-x-1'>
                            {skill.image &&
                            <Image className='rounded-full' src={skill.image} alt={skill.name ?? ''} width={20} height={20} />
                            }
                            <span className='opacity-70 text-sm'>{skill.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    }
                  </div>
                )
              }


              <h2 className='text-xl font-medium'>Project Team Members</h2>
              <p className='opacity-30 mb-10'>No Members</p>  
            </div>
          </div>

          <div className='mt-8'>
            <div className='mb-2'>Updates</div>
            {project.updates.map(update => (
              <div key={update.id} className=' text-white border p-4 rounded mb-4'>
                <h3>{update.title}</h3>
                <p>{update.content}</p>
              </div>
            ))}
          </div>
        </div>
    )
}

export default ProjectPage
