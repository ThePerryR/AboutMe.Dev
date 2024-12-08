import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import GitHubCalendar from 'react-github-calendar';

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import UploadButtonWrapper from "../../../_components/upload-button";
import ProfilePicture from "../../../ProfilePicture";
import Name from "../../../Name";
import Navigation from "../../../Navigation";
import Location from "../../../Location";
import Links from "../../../Links";
import Statuses from "../../../Statuses";
import profile from '../../profile.png'
import { Visibility } from "@prisma/client";
import { useState } from "react";
import Visiblity from "./Visibility";
const faceEmojis = ['🤩', '🥳', '🥸', '🤪', '🤯', '🤠', '😵‍💫', '🫨', '🙄', '🤔', '😬', '😶', '😀', '😃', '😄', '😁', '😆', '🫥', '🤓', '🦊', '🐼']

export default async function Home() {
  noStore();
  const session = await getServerAuthSession();

  if (!session?.user) return null

  const userQuery = await api.post.fetchMyUser.query()
  if (!userQuery) {
    return null;
  }
  const randomEmoji = faceEmojis[Math.floor(Math.random() * faceEmojis.length)]
  return (
    <div className=''>
      <Visiblity
        profileVisibility={userQuery.profileVisibility ?? Visibility.PUBLIC}
      />
      <ProfilePicture emoji={randomEmoji ?? '😀'} initialImage={session.user.image ?? undefined} />
      <Statuses initialNationality={userQuery.nationalityEmoji} initialStatus={userQuery.statusEmoji} />
      <Name initialName={userQuery.name ?? undefined} initialHeadline={userQuery.headline ?? undefined} />
      <Location initialRegion={userQuery.region ?? undefined} initialLocation={userQuery.location ?? undefined} />
      <Links
        username={userQuery.username ?? ''}
        initialTwitter={userQuery.twitterUsername ?? undefined}
        initialLinkedin={userQuery.linkedinUsername ?? undefined}
        initialWebsite={userQuery.website ?? undefined}
      />
    </div>
  );
}
