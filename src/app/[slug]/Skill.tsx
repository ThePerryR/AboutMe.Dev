'use client'

import React from 'react'
import { type Skill, User } from '@prisma/client';
import Image from 'next/image';
import * as Tooltip from '@radix-ui/react-tooltip';

const SkillShow = ({ skill }: { skill: Skill & { image: string } }) => {
    return (
        <Tooltip.Provider delayDuration={300}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <div className='w-[18px] h-[18px] flex items-center justify-center'>
                        <Image src={skill.image} alt='skill' width={12} height={12} className='' />
                    </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-black text-opacity-80 select-none rounded-[4px] bg-white px-[10px] py-[6px] text-[13px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                        sideOffset={5}>
                        {skill.name}<span className='opacity-50 ml-2'>{skill.type}</span>
                        <Tooltip.Arrow className="fill-white" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};

export default SkillShow

