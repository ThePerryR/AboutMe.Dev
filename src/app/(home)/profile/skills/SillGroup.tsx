import React from 'react'
import { type UserSkill, type Skill } from '@prisma/client';

import Skills from './Skills';


const SkillGroup = ({ primary, skills, toggleSkill }: { primary?: boolean, skills: (UserSkill & { skill: Skill })[], toggleSkill: (id: number, skill: Skill) => Promise<void> }) => {
  const languages = skills.filter(skill => skill.skill.type === 'language');
  const library = skills.filter(skill => skill.skill.type === 'library');
  const framework = skills.filter(skill => skill.skill.type === 'framework');
  const tool = skills.filter(skill => skill.skill.type === 'tool');

  return (
    <div className='w-full space-y-4 mt-4'>
      {languages.length > 0 &&
      <Skills skills={languages} toggleSkill={(id, skill) => toggleSkill(id, skill)} label='Languages' />
      }
      {library.length > 0 &&
      <Skills skills={library} toggleSkill={(id, skill) => toggleSkill(id, skill)} label='Libraries' />
      }
      {framework.length > 0 &&
      <Skills skills={framework} toggleSkill={(id, skill) => toggleSkill(id, skill)} label='Frameworks' />
      }
      {tool.length > 0 &&
      <Skills skills={tool} toggleSkill={(id, skill) => toggleSkill(id, skill)} label='Tools' />
      }
    </div>
  )
}

export default SkillGroup
