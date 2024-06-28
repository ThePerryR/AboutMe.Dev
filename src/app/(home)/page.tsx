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
const faceEmojis = ['🤩', '🥳', '🥸', '🤪', '🤯', '🤠', '😵‍💫', '🫨', '🙄', '🤔', '😬', '😶', '😀', '😃', '😄', '😁', '😆', '🫥', '🤓', '🦊', '🐼']

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  if (!session?.user) {
    return (
      <div className="bg-black pl-4 sm:pl-10 pb-10 pr-4 sm:pr-0">
        <div className='max-w-[1608px] mx-auto'>
          <div className='relative text-black flex space-x-[140px]'>
            <div className="flex flex-col items-start pt-6 sm:max-w-[500px] lg:max-w-[680px]">
              <div className='text-white bg-white text-opacity-60 text-sm mb-8 border border-white border-opacity-5 bg-opacity-10 py-2 px-4 rounded-full'>
                Built by a <Link href='https://www.aboutme.dev/ThePerryR' className='underline'>developer</Link> for developers
              </div>
              <h1 className='font-mono text-white text-3xl sm:text-6xl mb-4 sm:mb-8'>
                Showcase Yourself, Share Your Story
              </h1>
              <h2 className='text-lg text-white text-opacity-60 mb-8 sm:mb-12 sm:max-w-[440px]'>
                Create a dynamic developer profile that speaks to your skills, projects, and coding journey.
              </h2>

              <Link href="/api/auth/signin" className='text-white opacity-100 hover:opacity-80 mb-14 sm:mb-28 text-lg uppercase flex items-center'>
                <svg width="33" height="32" className='h-5 mr-1' viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16.2847 0C7.27967 0 0 7.33333 0 16.4057C0 23.6577 4.66433 29.7963 11.135 31.969C11.944 32.1323 12.2403 31.616 12.2403 31.1817C12.2403 30.8013 12.2137 29.4977 12.2137 28.1393C7.68367 29.1173 6.74033 26.1837 6.74033 26.1837C6.01233 24.2823 4.93367 23.7937 4.93367 23.7937C3.451 22.7887 5.04167 22.7887 5.04167 22.7887C6.68633 22.8973 7.54933 24.4727 7.54933 24.4727C9.005 26.9713 11.3507 26.2653 12.2943 25.8307C12.429 24.7713 12.8607 24.038 13.319 23.6307C9.706 23.2503 5.90467 21.838 5.90467 15.5363C5.90467 13.7437 6.55133 12.277 7.576 11.1363C7.41433 10.729 6.848 9.04467 7.738 6.79033C7.738 6.79033 9.113 6.35567 12.2133 8.47433C13.5407 8.11522 14.9096 7.93254 16.2847 7.931C17.6597 7.931 19.0613 8.12133 20.3557 8.47433C23.4563 6.35567 24.8313 6.79033 24.8313 6.79033C25.7213 9.04467 25.1547 10.729 24.993 11.1363C26.0447 12.277 26.6647 13.7437 26.6647 15.5363C26.6647 21.838 22.8633 23.223 19.2233 23.6307C19.8167 24.1467 20.3287 25.1243 20.3287 26.6727C20.3287 28.8727 20.302 30.6383 20.302 31.1813C20.302 31.616 20.5987 32.1323 21.4073 31.9693C27.878 29.796 32.5423 23.6577 32.5423 16.4057C32.569 7.33333 25.2627 0 16.2847 0Z" fill="white" />
                </svg>

                <span>Join now</span>
              </Link>

              <h3 className='text-white font-mono text-lg  sm:text-xl mb-3 sm:mb-5 opacity-80'>Why join aboutme.dev?</h3>
              <p className='text-white opacity-60 leading-loose text-lg sm:text-base sm:pr-4 lg:pr-8'>
                Unlock the door to new opportunities with a profile that&apos;s more than a resume. <b>aboutme.dev</b> lets you vividly demonstrate your coding ability, track your progress over time, and connect with a network of professionals. Whether you&apos;re seeking new challenges, showcasing your latest project, or just keeping your coding history up to date, this is the platform for developers who mean business.
              </p>
            </div>
            <div className='hidden sm:block w-[524px] shrink-0 relative'>
              <div style={{ right: 'Calc(100% + -14px)' }} className='absolute top-[128px]  text-sm bg-[#0079de] text-white text-opacity-90 w-full max-w-[140px] py-1 px-2 rounded text-left'>
                Share your Github contribution chart.
                <span className='absolute right-[-30px] text-3xl font-bold text-[#0079de] top-1/2 transform -translate-y-1/2 mt-[-6px]'>⟶</span>
              </div>
              <div style={{ right: 'Calc(100% + -14px)' }} className='absolute top-[232px]  text-sm bg-[#0079de] text-white text-opacity-90 w-full max-w-[140px] py-1 px-2 rounded text-left'>
                Showcase the tools you use most.
                <span className='absolute right-[-30px] text-3xl font-bold text-[#0079de] top-1/2 transform -translate-y-1/2 mt-[-6px]'>⟶</span>
              </div>
              <div style={{ right: 'Calc(100% + -14px)' }} className='absolute top-[348px]  text-sm bg-[#0079de] text-white text-opacity-90 w-full max-w-[140px] py-1 px-2 rounded text-left'>
                Present your best work...
                <span className='absolute right-[-30px] text-3xl font-bold text-[#0079de] top-1/2 transform -translate-y-1/2 mt-[-6px]'>⟶</span>
              </div>
              <div style={{ right: 'Calc(100% + -14px)' }} className='absolute top-[426px]  text-sm bg-[#0079de] text-white text-opacity-90 w-full max-w-[140px] py-1 px-2 rounded text-left'>
                ...and which skills you used.
                <span className='absolute right-[-30px] text-3xl font-bold text-[#0079de] top-1/2 transform -translate-y-1/2 mt-[-6px]'>⟶</span>
              </div>
              <div style={{ right: 'Calc(100% + -14px)' }} className='absolute top-[658px]  text-sm bg-[#0079de] text-white text-opacity-90 w-full max-w-[140px] py-1 px-2 rounded text-left'>
                List out your experience.
                <span className='absolute right-[-30px] text-3xl font-bold text-[#0079de] top-1/2 transform -translate-y-1/2 mt-[-6px]'>⟶</span>
              </div>
              <div style={{ right: 'Calc(100% + -14px)' }} className='absolute top-[921px]  text-sm bg-[#0079de] text-white text-opacity-90 w-full max-w-[140px] py-1 px-2 rounded text-left'>
                Share whats important to you.
                <span className='absolute right-[-30px] text-3xl font-bold text-[#0079de] top-1/2 transform -translate-y-1/2 mt-[-6px]'>⟶</span>
              </div>
              <Image src={profile} alt="Profile" className='border border-white rounded-xl p-2 border-opacity-30 ml-[32px] mt-[16px]' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const userQuery = await api.post.fetchMyUser.query()
  if (!userQuery) {
    return null;
  }
  const randomEmoji = faceEmojis[Math.floor(Math.random() * faceEmojis.length)]
  return (
    <div>
      <div>Recent Updates</div>
      <div className='text-sm opacity-50'>Coming Soon...</div>
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