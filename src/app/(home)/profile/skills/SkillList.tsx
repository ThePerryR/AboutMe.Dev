import React, { useEffect, useRef, useState } from 'react';
import { UserSkill, type Skill } from '@prisma/client';
import Image from 'next/image';
import classNames from 'classnames';

import { api } from '~/trpc/react';
import SkillGroup from './SillGroup';
import Skills from './Skills';

const SkillList = ({ allSkills, skills, addSkill, toggleSkill, primary }: { primary?: boolean, allSkills: Skill[], skills: Skill[], addSkill: (name: string) => Promise<void>, toggleSkill: (id: number, skill: Skill) => Promise<void> }) => {
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
            <div className='relative mb-4'>
                <input
                    type='text'
                    ref={inputRef}
                    placeholder='Search skills'
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setHighlightedIndex(0)
                    }}
                    className='w-full border-white/10 bg-white/5 border rounded p-2 text-sm text-white text-opacity-80'
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
                                void toggleSkill(highlightedSkill.id, highlightedSkill);
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
                                    void toggleSkill(skill.id, skill);
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

            <Skills
              skills={skills}
              toggleSkill={toggleSkill}
              label=''
            />
        </div>
    );
}

export default SkillList;
