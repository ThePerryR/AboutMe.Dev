import React from 'react'
import Image from 'next/image'

import IntroImage from './intro.png'

import './styles.css'

const Section = ({ id, title, videoUrl, children }: { id?: string, title: string, videoUrl: string, children: React.ReactNode[] }) => {
    return (
        <section id={id} className='flex flex-col md:flex-row items-center px-4 md:space-x-4 lg:space-x-8 pb-20'>
            <div className='md:w-1/2 md:px-12 md:pt-20'>
                <h3>{title}</h3>
                {children}
            </div>
            <div className='md:w-1/2'>
                <video width="720" height="480" className='w-full'
                    autoPlay controls preload="metadata">
                    <source src={videoUrl} type="video/mp4" />
                </video>
            </div>
        </section>
    )
}

const MacWarning = () => {
    return (
        <div className='bg-blue-500 bg-opacity-10 border-blue-500 border border-opacity-40 text-white text-opacity-70 rounded-full py-1 px-3'>
            <span className='mr-2'></span> <span className='opacity-60'>This lesson is designed for Macs.</span>
        </div>
    )
}

const TerminalLesson = () => {
    return (
        <article className='text-white'>
            <div className='flex items-center flex-col-reverse md:flex-row px-4 md:space-x-4 lg:space-x-8 md:pt-12 pb-28'>
                <div className='md:w-1/2 md:px-8 lg:px-12 flex flex-col items-start'>
                    <h1 className='opacity-80 text-4xl mb-6 font-mono max-w-xl'>
                        Terminal for beginners
                    </h1>
                    <h2 className='opacity-70 text-xl leading-loose mb-8'>
                        The terminal is a key way to interact with your computer as a programmer. In this course we&apos;ll be going over the basics of using the terminal.
                    </h2>
                    <MacWarning />
                </div>
                <div className='md:w-1/2'>
                    <Image src={IntroImage} alt='Image of the Mac terminal showing "Terminal for beginners" in ASCII art.' />
                </div>
            </div>
            <Section
                id='intro'
                title='1. Open the terminal'
                videoUrl='/list.mp4'>
                <p>
                    Press <code>⌘-Space</code> to open Spotlight and search for “Terminal”. Press enter to open it.
                </p>
                <p>
                    The terminal lets you navigate your computer&apos;s file system using text commands. You start in your home directory denoted by &quot;~&quot;.
                </p>
                <p className='instructions'>
                    Type <code>ls</code> and press enter to list contents of the current directory.
                </p>
                <p className='instructions'>
                    Now enter <code>clear</code> to clear your Terminal.
                </p>
            </Section>
            <Section
                title='2. Navigating your directories'
                videoUrl='/cd.mp4'>
                <p>
                    You can change which directory you&apos;re in by using the &quot;cd&quot; command.
                </p>
                <p>
                    Enter <code>cd Desktop</code> to go into your Desktop folder.
                </p>
                <p>
                    Enter<code>cd ../</code> to go <b>up</b> a folder. You should be back in your home directory.
                </p>
                <p>
                    Now try navigating to the Documents directory.
                </p>
            </Section>
            <Section
                title='3. Creating folders'
                videoUrl='/mkdir.mp4'>
                <p>
                    You can create directories using the &quot;mkdir&quot; command.
                </p>
                <p>
                    Lets create a new folder called &quot;aboutme&quot; to store our projects in.
                </p>
                <ol>
                    <li>Enter <code>cd ~/Documents</code> to go to your Documents folder.</li>
                    <li>Enter <code>mkdir aboutme</code> to create a new directory.</li>
                    <li>Enter <code>cd aboutme</code> to open your new folder.</li>
                </ol>
                <p>You can use the &quot;open&quot; command to open a directory in Finder. For example, <code>open ~/Documents/aboutme</code> or <code>open .</code> to open the directory you&apos;re currently in.</p>
            </Section>
        </article>
    )
}

export default TerminalLesson
