import React, { useEffect, useRef, useState } from 'react';
import { type Skill } from '@prisma/client';
import { api } from '~/trpc/react';
import Image from 'next/image';

const SkillList = ({ allSkills, skills, addSkill, toggleSkill }: { allSkills: Skill[], skills: Skill[], addSkill: (name: string) => Promise<void>, toggleSkill: (id: number) => Promise<void> }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState(false);
    const [search, setSearch] = useState('');
    const skillSearchQuery = api.post.searchSkills.useQuery({ search, exclude: allSkills.map(skill => skill.id) });

    useEffect(() => {
        // event on HtmlDivElement
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node | null)) {
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
                    placeholder='Search skills'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-full bg-black bg-opacity-5 border border-white border-opacity-10 rounded px-2 py-1 text-sm text-white text-opacity-80'
                    onFocus={() => setFocused(true)}
                />
                {focused && (
                    <div className='absolute bottom-full left-0 w-full bg-gray-800 text-xs rounded-b z-10'>
                        {skillSearchQuery.data?.map(skill => (
                            <div
                                key={skill.id}
                                onClick={() => {
                                    void toggleSkill(skill.id);
                                }}
                                className='px-2 flex items-center py-1 hover:bg-white hover:bg-opacity-5 cursor-pointer'>
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
            <div className='flex mt-2 flex-wrap gap-2'>
                {skills.map(skill => (
                    <div
                        key={skill.id}
                        onClick={() => {
                            void toggleSkill(skill.id);
                        }}
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
                ))}
            </div>
        </div>
    );
}

export default SkillList;
