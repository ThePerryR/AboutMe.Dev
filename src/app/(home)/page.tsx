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

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  if (!session?.user) {
    return (
      <div className="bg-black px-4">
        <div className='max-w-[1608px] mx-auto'>
          <div className='relative h-screen overflow-hidden text-black flex justify-center space-x-10'>
            <div className="max-w-2xl">
              <h1 className='font-mono text-white text-4xl leading-relaxed'>
                Tell your developer story. Share useful information.
              </h1>
            </div>
            <div className='w-[524px] overflow-hidden'>
              <GitHubCalendar
                username='chkaram'
                colorScheme="dark"
                hideColorLegend
                hideMonthLabels
                hideTotalCount
              />
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
  return (
    <>
      <ProfilePicture initialImage={session.user.image ?? undefined} />
      <Name initialName={session.user.name ?? undefined} />
      <Location initialRegion={userQuery.region ?? undefined} initialLocation={userQuery.location ?? undefined} />
      <Links 
        username={userQuery.username ?? ''} 
        initialTwitter={userQuery.twitterUsername ?? undefined}
        initialLinkedin={userQuery.linkedinUsername ?? undefined}
        initialWebsite={userQuery.website ?? undefined}
      />
    </>
  );
}
