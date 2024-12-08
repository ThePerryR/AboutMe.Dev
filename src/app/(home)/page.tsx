import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import GitHubCalendar from 'react-github-calendar';

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import UploadButtonWrapper from "../_components/upload-button";
import ProfilePicture from "../ProfilePicture";
import Name from "../Name";
import Navigation from "../Navigation";
import Location from "../Location";
import Links from "../Links";
import Statuses from "../Statuses";
import profile from './profile.png'
import classNames from "classnames";
const faceEmojis = ['🤩', '🥳', '🥸', '🤪', '🤯', '🤠', '😵‍💫', '🫨', '🙄', '🤔', '😬', '😶', '😀', '😃', '😄', '😁', '😆', '🫥', '🤓', '🦊', '🐼']

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  const userQuery = session?.user ? await api.post.fetchMyUser.query() : undefined
  const dashboardQuery = await api.post.fetchDashboard.query()
  const randomEmoji = faceEmojis[Math.floor(Math.random() * faceEmojis.length)]
  return (
    <div className='p-6 flex flex-col min-h-screen items-center justify-center'>
      <h1 className='text-3xl font-medium text-white/80'>Welcome to aboutme.dev</h1>
      <p className='text-sm text-white/60 max-w-xl text-center mt-5'>
        This site is currently in development. It currently allows you to create a profile to showcase your skills and projects. More amazing features are planned.
      </p>
      <div className='mt-10'>
      {userQuery
        ? (
          <Link href={`/${userQuery.username}`}>View your profile</Link>
        )
        : (
          <Link href="/api/auth/signin" className='text-white opacity-100 hover:opacity-80 text-xl uppercase flex items-center'>
            <svg width="32" height="40" className='h-10 mr-3' viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.2847 0C7.27967 0 0 7.33333 0 16.4057C0 23.6577 4.66433 29.7963 11.135 31.969C11.944 32.1323 12.2403 31.616 12.2403 31.1817C12.2403 30.8013 12.2137 29.4977 12.2137 28.1393C7.68367 29.1173 6.74033 26.1837 6.74033 26.1837C6.01233 24.2823 4.93367 23.7937 4.93367 23.7937C3.451 22.7887 5.04167 22.7887 5.04167 22.7887C6.68633 22.8973 7.54933 24.4727 7.54933 24.4727C9.005 26.9713 11.3507 26.2653 12.2943 25.8307C12.429 24.7713 12.8607 24.038 13.319 23.6307C9.706 23.2503 5.90467 21.838 5.90467 15.5363C5.90467 13.7437 6.55133 12.277 7.576 11.1363C7.41433 10.729 6.848 9.04467 7.738 6.79033C7.738 6.79033 9.113 6.35567 12.2133 8.47433C13.5407 8.11522 14.9096 7.93254 16.2847 7.931C17.6597 7.931 19.0613 8.12133 20.3557 8.47433C23.4563 6.35567 24.8313 6.79033 24.8313 6.79033C25.7213 9.04467 25.1547 10.729 24.993 11.1363C26.0447 12.277 26.6647 13.7437 26.6647 15.5363C26.6647 21.838 22.8633 23.223 19.2233 23.6307C19.8167 24.1467 20.3287 25.1243 20.3287 26.6727C20.3287 28.8727 20.302 30.6383 20.302 31.1813C20.302 31.616 20.5987 32.1323 21.4073 31.9693C27.878 29.796 32.5423 23.6577 32.5423 16.4057C32.569 7.33333 25.2627 0 16.2847 0Z" fill="white" />
            </svg>

            <span>Sign in with GitHub</span>
          </Link>
        )
      }
      </div>
      {/* <div>
        <h2 className='mb-3 text-lg font-medium text-white/60'>New Users</h2>
        {dashboardQuery.recentUsers.length === 0 
          ? (
            <div className='text-sm border border-dashed border-white border-opacity-10 text-white/40 flex items-center justify-center py-14 rounded-lg p-4'>
              No users to display
            </div>
          )
          : (
            <div className='grid grid-cols-4 gap-4 md:grid-cols-8'>
              {dashboardQuery.recentUsers.map(user => (
                <Link href={`/${user.username}`} key={user.id}>
                  <Image
                    src={user.image ?? ''}
                    alt={user.name ?? ''}
                    width={100}
                    height={100}
                    className='rounded'
                  />
                  <div className='text-sm mt-1'>{user.name}</div>
                </Link>
              ))}
          </div>
          )
        }
      </div>

      <div className='mt-6 md:mt-16'>
        <h2 className='mb-3 text-lg font-medium text-white/60'>Recent Projects</h2>
        {dashboardQuery.recentProjects.length === 0 
          ? (
            <div className='text-sm border border-dashed border-white border-opacity-10 text-white/40 flex items-center justify-center py-14 rounded-lg p-4'>
              No projects to display
            </div>
          )
          : (
            <div className='grid grid-cols-4 gap-4 md:grid-cols-4'>
              {dashboardQuery.recentProjects.map(project => (
                <Link href={`/project/${project.id}`} key={project.id}>
                  {project.image
                    ? (
                    <Image src={project.image} alt={project.name ?? ''} width={220} height={100} className='rounded w-[220px] h-[100px] object-cover' />
                    )
                    : (
                      <div className='rounded bg-white/5 w-[220px] h-[100px] flex items-center justify-center'>
                        <div className='text-sm text-white/40'>No image</div>
                      </div>
                    )
                  }

                  <div className={classNames('text-sm mt-1 w-[220px] truncate', project.name ? '' : 'text-white/40')}>{project.name ?? 'Untitled'}</div>
                </Link>
              ))}
            </div>
          )
        }
      </div> */}
    </div>
  );
}

/*
<ProfilePicture emoji={randomEmoji ?? '😀'} initialImage={session.user.image ?? undefined} />
      <Statuses initialNationality={userQuery.nationalityEmoji} initialStatus={userQuery.statusEmoji} />
      <Name initialName={session.user.name ?? undefined} />
      <Location initialRegion={userQuery.region ?? undefined} initialLocation={userQuery.location ?? undefined} />
      <Links
        username={userQuery.username ?? ''}
        initialTwitter={userQuery.twitterUsername ?? undefined}
        initialLinkedin={userQuery.linkedinUsername ?? undefined}
        initialWebsite={userQuery.website ?? undefined}
      />
      */