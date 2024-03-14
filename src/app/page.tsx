import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import GitHubCalendar from 'react-github-calendar';

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  if (!session?.user) {
    return (
      <div className="bg-black">
        <div className='relative h-screen overflow-hidden text-black flex justify-center space-x-10'>
          <div className="max-w-2xl">
            <h1 className='font-mono text-white text-4xl leading-relaxed'>
              Tell your developer story. Share useful information.
            </h1>
          </div>
          <div className=''>
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
    )
  }

  console.log(session)

  return (
    <main className="">
      
    </main>
  );
}
