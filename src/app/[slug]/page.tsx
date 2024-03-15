import { type Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import GitHubCalendar from 'react-github-calendar'
import { getServerAuthSession } from '~/server/auth';
import { api } from "~/trpc/server";

async function fetchGithubData(session: Session | null, username: string) {
    if (session !== null) {
        return
    }
    const res = await fetch(`https://api.github.com/users/${username}`)
    const data = await res.json() as { login: string, id: number, node_id: string, avatar_url: string, gravatar_id: string, url: string, html_url: string, followers_url: string, following_url: string, gists_url: string, starred_url: string, subscriptions_url: string, organizations_url: string, repos_url: string, events_url: string, received_events_url: string, type: string, site_admin: boolean, name: string, company: string, blog: string, location: string, email: string, hireable: boolean, bio: string, twitter_username: string, public_repos: number, public_gists: number, followers: number, following: number, created_at: string, updated_at: string }
    return data
}

const UserPage = async ({ params }: { params: { slug: string } }) => {
    const session = await getServerAuthSession()
    const userQuery = await api.post.fetchUser.query(params.slug)
    const githubData = await fetchGithubData(session, params.slug)
    // const userInfo = await api.post
    console.log('yo', { githubData, session, userQuery })
    if (session === null && githubData === undefined) {
        return null
    }
    return (
        <div className='flex flex-col items-center py-10 text-white text-opacity-80 px-6'>
            <div className='flex w-full max-w-[844px] mb-8 justify-between'>
                <div className='flex'>
                    <Image src={session?.user.image ?? githubData?.avatar_url ?? '/no-picture.jpg'} alt='avatar' width={100} height={100} className='rounded' />
                    <div className='ml-4'>
                        <h1 className='text-4xl font-bold mb-1'>{session?.user.name ?? githubData?.name}</h1>
                        {/* <h2 className='text-2xl opacity-60'>{session?.user.location}</h2> */}
                    </div>
                </div>
                <div className='space-y-2'>
                    {userQuery?.twitterUsername &&
                        <div>
                            <Link href={`https://x.com/${userQuery?.twitterUsername}`}  className='opacity-90 hover:opacity-100'>
                                <div className='flex items-center'>
                                    <div className='w-7'>
                                        𝕏
                                    </div>
                                    <div className=''>{params.slug}</div>
                                </div>
                            </Link>
                        </div>
                    }
                    <div>
                        <Link href={`https://github.com/${params.slug}`} className='opacity-90 hover:opacity-100'>
                            <div className='flex items-center'>
                                <div className='w-7'>
                                    <svg width="33" height="32" className='w-4 h-4' viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M16.2847 0C7.27967 0 0 7.33333 0 16.4057C0 23.6577 4.66433 29.7963 11.135 31.969C11.944 32.1323 12.2403 31.616 12.2403 31.1817C12.2403 30.8013 12.2137 29.4977 12.2137 28.1393C7.68367 29.1173 6.74033 26.1837 6.74033 26.1837C6.01233 24.2823 4.93367 23.7937 4.93367 23.7937C3.451 22.7887 5.04167 22.7887 5.04167 22.7887C6.68633 22.8973 7.54933 24.4727 7.54933 24.4727C9.005 26.9713 11.3507 26.2653 12.2943 25.8307C12.429 24.7713 12.8607 24.038 13.319 23.6307C9.706 23.2503 5.90467 21.838 5.90467 15.5363C5.90467 13.7437 6.55133 12.277 7.576 11.1363C7.41433 10.729 6.848 9.04467 7.738 6.79033C7.738 6.79033 9.113 6.35567 12.2133 8.47433C13.5407 8.11522 14.9096 7.93254 16.2847 7.931C17.6597 7.931 19.0613 8.12133 20.3557 8.47433C23.4563 6.35567 24.8313 6.79033 24.8313 6.79033C25.7213 9.04467 25.1547 10.729 24.993 11.1363C26.0447 12.277 26.6647 13.7437 26.6647 15.5363C26.6647 21.838 22.8633 23.223 19.2233 23.6307C19.8167 24.1467 20.3287 25.1243 20.3287 26.6727C20.3287 28.8727 20.302 30.6383 20.302 31.1813C20.302 31.616 20.5987 32.1323 21.4073 31.9693C27.878 29.796 32.5423 23.6577 32.5423 16.4057C32.569 7.33333 25.2627 0 16.2847 0Z"
                                            fill="white"
                                        />
                                    </svg>
                                </div>
                                <div>{params.slug}</div>
                            </div>
                        </Link>
                        {userQuery?.githubCreatedAt &&
                            <div className='text-xs text-opacity-50 text-white mt-2'>
                                Created {userQuery.githubCreatedAt.toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" })}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <GitHubCalendar username={params.slug} />
        </div>
    )
}

export default UserPage
