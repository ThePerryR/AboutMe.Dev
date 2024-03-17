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
export const revalidate = 0 // 6 minutes
 
const programmingEmojis = [
  '💻', // Computer
  '🖥️', // Desktop Computer
  '🖱️', // Computer Mouse
  '⌨️', // Keyboard
  '💾', // Floppy Disk
  '💿', // Computer Disk
  '📀', // DVD
  '📼', // Videocassette
  '🧮', // Abacus
  '🔢', // Input Numbers
  '🔣', // Input Symbols
  '🔤', // Input Latin Letters
  '⌚️', // Watch
  '⏱️', // Timer
  '⏲️', // Timer Clock
  '⏰', // Alarm Clock
  '🕰️', // Mantelpiece Clock
  '⌛️', // Hourglass
  '⏳', // Hourglass with Flowing Sand
  '📡', // Satellite Antenna
  '💡', // Light Bulb
  '🔌', // Electric Plug
  '🔋', // Battery
  '🪫', // Crutch
  '🔍', // Magnifying Glass
  '🔎', // Magnifying Glass Tilted Right
  '🔬', // Microscope
  '🔭', // Telescope
  '📡', // Satellite
  '⚙️', // Gear
  '⚒️', // Hammer and Wrench
  '⛓️', // Chains
  '🔩', // Nut and Bolt
  '⚗️', // Alembic
  '🧪', // Test Tube
  '🔗', // Link
  '⛓️', // Chains
  '🧰', // Toolbox
  '🔧', // Wrench
  '⚒️', // Hammer and Pick
  '🔨', // Hammer
  '⚙️', // Gear
  '⚡️', // High Voltage
  '🔦', // Flashlight
  '💶', // Euro Banknote
  '💷', // Pound Banknote
  '💴', // Yen Banknote
  '💵', // Dollar Banknote
  '🧮' // Abacus
]

// Image generation
export default function Icon() {
  const randomEmoji = programmingEmojis[Math.floor(Math.random() * programmingEmojis.length)]
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
        {randomEmoji}
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