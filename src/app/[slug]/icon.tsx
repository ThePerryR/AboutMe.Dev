import { ImageResponse } from 'next/og'
import { api } from '~/trpc/server'
 
// Route segment config
// export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default async function Icon({ params }: { params: { slug: string } }) {
  console.log(params, 'cococococo')
  const userQuery = await api.post.fetchUser.query(params.slug)
  console.log(userQuery?.statusEmoji)
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        {userQuery?.statusEmoji ?? '📦'}
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}