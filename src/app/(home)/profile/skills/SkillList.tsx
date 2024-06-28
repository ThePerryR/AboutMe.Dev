import React, { useEffect, useRef, useState } from 'react';
import { type Skill } from '@prisma/client';
import { api } from '~/trpc/react';
import Image from 'next/image';
import classNames from 'classnames';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const SkillList = ({ allSkills, skills, addSkill, toggleSkill, primary }: { primary?: boolean, allSkills: Skill[], skills: Skill[], addSkill: (name: string) => Promise<void>, toggleSkill: (id: number) => Promise<void> }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const skillSearchQuery = api.post.searchSkills.useQuery({ search, exclude: allSkills.map(skill => skill.id) });

    useEffect(() => {
        // event on HtmlDivElement
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node | null)) {
                setHighlightedIndex(0);
                setFocused(false);
            }
        };

        // Add when the component mounts
        document.addEventListener("mousedown", handleClickOutside);
        // Return function to be called when it unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef}>
            <div className='relative'>
                <input
                    type='text'
                    ref={inputRef}
                    placeholder='Search skills'
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setHighlightedIndex(0)
                    }}
                    className='w-full bg-black bg-opacity-5 border border-white border-opacity-10 rounded px-2 py-1 text-sm text-white text-opacity-80'
                    onFocus={() => setFocused(true)}
                    onKeyDown={e => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setHighlightedIndex((prev) => (prev + 1) % (skillSearchQuery.data?.length ?? 0));
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setHighlightedIndex((prev) => (prev - 1 + (skillSearchQuery.data?.length ?? 0)) % (skillSearchQuery.data?.length ?? 0));
                        } else if (e.key === 'Enter') {
                            e.preventDefault();
                            if (skillSearchQuery.data) {
                                const highlightedSkill = skillSearchQuery.data[highlightedIndex]
                                if (!highlightedSkill) return
                                void toggleSkill(highlightedSkill.id);
                                setHighlightedIndex(0);
                                setSearch('');
                            }
                        } else if (e.key === 'Escape') {
                            e.preventDefault();
                            setFocused(false);
                        }
                    }}
                />
                {focused && (
                    <div className='absolute top-full py-1 left-0 w-full bg-gray-800 text-xs rounded-b z-10'>
                        {skillSearchQuery.data?.map((skill, i) => (
                            <div
                                key={skill.id}
                                onClick={() => {
                                    void toggleSkill(skill.id);
                                }}
                                className={classNames('px-2 flex items-center py-1.5 hover:bg-white hover:bg-opacity-5 cursor-pointer', highlightedIndex === i ? 'bg-opacity-5 bg-white' : '')}>
                                <div className='w-[20px]'>
                                    {skill.image &&
                                        <Image
                                            src={skill.image}
                                            alt={skill.name ?? ''}
                                            width={16}
                                            height={16}
                                            className=''
                                        />
                                    }
                                </div>
                                <div>{skill.name}</div>
                            </div>
                        ))}
                        {search && !skillSearchQuery.data?.find(s => s.name?.toLowerCase() === search.toLowerCase()) &&
                            <div
                                onClick={async () => {
                                    await addSkill(search);
                                    setSearch('');
                                    setFocused(false); // Close dropdown after adding
                                    void skillSearchQuery.refetch();
                                }}
                                className='px-2 py-1 hover:bg-white hover:bg-opacity-5 cursor-pointer'>
                                + Add &quot;{search}&quot;
                            </div>
                        }
                    </div>
                )}
            </div>

            <SkillGroup
              skills={skills}
              toggleSkill={toggleSkill}
              primary={primary}
            />
        </div>
    );
}

const SkillGroup = ({ primary, skills, toggleSkill }: { primary?: boolean, skills: Skill[], toggleSkill: (id: number) => Promise<void> }) => {
  const languages = skills.filter(skill => skill.type === 'language');
  const library = skills.filter(skill => skill.type === 'library');
  const framework = skills.filter(skill => skill.type === 'framework');
  const tool = skills.filter(skill => skill.type === 'tool');

  
  return (
    <div className='w-full space-y-4 mt-4'>
        {languages.length > 0 &&
            <SkillListt id={primary ? 'primary-languages' : 'languages'} skills={languages} toggleSkill={(skill) => toggleSkill(skill)} label='Languages' />
        }
        {library.length > 0 &&
            <SkillListt id={primary ? 'primary-library' : 'library'} skills={library} toggleSkill={(skill) => toggleSkill(skill)} label='Libraries' />
        }
        {framework.length > 0 &&
            <SkillListt id={primary ? 'primary-framework' : 'framework'} skills={framework} toggleSkill={(skill) => toggleSkill(skill)} label='Frameworks' />
        }
        {tool.length > 0 &&
            <SkillListt id={primary ? 'primary-tool' : 'tools'} skills={tool} toggleSkill={(skill) => toggleSkill(skill)} label='Tools' />
        }
    </div>
  )
}

const SkillListt = ({ id, skills, toggleSkill, label }: { id: string, skills: Skill[], toggleSkill: (id: number) => Promise<void>, label: string }) => {
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

const SkillTab = ({ skill, toggleSkill }: { skill: Skill, toggleSkill: (id: number) => Promise<void> }) => {
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      
      className='cursor-pointer flex items-center hover:opacity-50 space-x-2 border border-white border-opacity-20 px-2 py-1 rounded-full text-white text-opacity-70 bg-white bg-opacity-5 text-xs'>
      {skill.image &&
          <Image
              src={skill.image}
              alt={skill.name ?? ''}
              width={16}
              height={16}
              className=''
          />
      }
      <div>{skill.name}</div>
  </div>
  )
}
export default SkillList;
