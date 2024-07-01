import { UserSkill, type Skill } from '@prisma/client';
import React from 'react'
import {
  useSortable
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Image from 'next/image';
import Skills from './Skills';
import { Bars3Icon } from '@heroicons/react/20/solid';

const SkillTab = ({ skill, toggleSkill }: { skill: Skill, toggleSkill: (id: number, skill: Skill) => Promise<void> }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: skill.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} className='cursor-pointer flex items-center space-x-3 border border-white border-opacity-20 px-2 py-1 rounded-full text-white text-opacity-70 bg-white bg-opacity-5 text-xs'>
      <div 
        {...attributes} 
        {...listeners}
        className='cursor-move p-1'>
        <Bars3Icon className='w-3 h-3' />
      </div>
      <div className='flex items-center space-x-2 group' onClick={() => toggleSkill(skill.id, skill)}>
        {skill.image &&
          <Image
            src={skill.image}
            alt={skill.name ?? ''}
            width={16}
            height={16}
            className=''
          />
          }
          <div>
            <div className='group-hover:hidden'>{skill.name}</div>
            <div className='hidden group-hover:block text-red-500'>Remove</div>
          </div>
        </div>
    </div>
  )
}

export default SkillTab
