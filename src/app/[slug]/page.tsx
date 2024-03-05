import Image from 'next/image';
import React from 'react'
import GitHubCalendar from 'react-github-calendar'

async function fetchGithubData(username: string) {
    const res = await fetch(`https://api.github.com/users/${username}`)
    const data = await res.json() as { login: string, id: number, node_id: string, avatar_url: string, gravatar_id: string, url: string, html_url: string, followers_url: string, following_url: string, gists_url: string, starred_url: string, subscriptions_url: string, organizations_url: string, repos_url: string, events_url: string, received_events_url: string, type: string, site_admin: boolean, name: string, company: string, blog: string, location: string, email: string, hireable: boolean, bio: string, twitter_username: string, public_repos: number, public_gists: number, followers: number, following: number, created_at: string, updated_at: string }
    return data
}

const UserPage = async ({ params }: { params: { slug: string } }) => {
    const githubData = await fetchGithubData(params.slug)
    // const userInfo = await api.post
    console.log(githubData)
    return (
        <div className='flex flex-col items-center py-10 text-white text-opacity-80 '>
            <div className='flex w-full max-w-[844px] mb-8'>
                <Image src={githubData.avatar_url} alt='avatar' width={100} height={100} className='rounded' />
                <div className='ml-4'>
                    <h1 className='text-4xl font-bold mb-1'>{githubData.name}</h1>
                    <h2 className='text-2xl opacity-60'>{githubData.login}</h2>
                </div>
            </div>
            <GitHubCalendar username={params.slug} />
        </div>
    )
}

export default UserPage
