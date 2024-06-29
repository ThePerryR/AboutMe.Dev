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

  const userQuery = session?.user ? await api.post.fetchMyUser.query() : undefined
  const randomEmoji = faceEmojis[Math.floor(Math.random() * faceEmojis.length)]
  return (
    <div className='p-6 flex flex-col items-center justify-center min-h-screen'>
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