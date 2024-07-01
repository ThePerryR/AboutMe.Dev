import React from 'react'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import classNames from 'classnames';
import { type UserSkill, type Skill } from '@prisma/client';

import SkillTab from './SkillTab';

const Skills = ({ skills, toggleSkill, label }: { skills: Skill[], toggleSkill: (id: number, skill: Skill) => Promise<void>, label: string }) => {
  return (
    <SortableContext 
      items={skills}
      strategy={verticalListSortingStrategy}>
      <div>
        <div className='text-white text-opacity-50 text-sm'>{label}</div>
        <div className={classNames('flex mt-1 flex-wrap gap-2')}> {/* isOver ? 'border border-dashed rounded-full p-1' : ''*/}
          {skills.map(skill => (
            <SkillTab key={skill.id} skill={skill} toggleSkill={toggleSkill} />
          ))}
        </div>
      </div>
    </SortableContext>
  )
}

export default Skills
