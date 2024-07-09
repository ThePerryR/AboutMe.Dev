'use client'

import { type UserInterest, type Interest } from '@prisma/client'
import React, { useEffect, useRef, useState } from 'react'
import { api } from '~/trpc/react'
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { Bars3Icon } from '@heroicons/react/20/solid';

let dragTimeout: NodeJS.Timeout | null = null;
const Skills = () => {
    const [interests, setInterests] = React.useState<(UserInterest & { interest: Interest })[]>([]);
    const interestsQuery = api.post.getInterests.useQuery()
    const addInterestMutation = api.post.addInterest.useMutation({
        onSuccess: () => {
            void interestsQuery.refetch()
        }
    })
    const toggleInterestMutation = api.post.toggleInterest.useMutation({
        onSuccess: () => {
            void interestsQuery.refetch()
        }
    })
    const changeOrderMutation = api.post.updateInterestOrder.useMutation()
    
    useEffect(() => {
      if (interestsQuery.data) {
          console.log(interestsQuery.data)
          setInterests(interestsQuery.data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      }
    }, [interestsQuery.data])
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );
    function handleDragEnd (event: DragEndEvent) {
      const {active, over} = event;
      console.log('drag end')
      if (over && active.id !== over.id) {
        setInterests((items) => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          
          const newInterests = arrayMove(items, oldIndex, newIndex);
          console.log('fooo', newInterests.map((interest, i) => ({ id: interest.id, order: i })))
          changeOrderMutation.mutate(newInterests.map((interest, i) => ({ id: interest.id, order: i })))
          return newInterests
        });
      } else {
        changeOrderMutation.mutate(interests.map((interest, i) => ({ id: interest.id, order: i })))
      }
    }

    function handleDragOver (event: DragEndEvent) {
      const {active, over} = event;
      if (!over || active.id === over.id) return;

      const activeInterest = interests.find(item => item.id === active.id);
      const overInterest = interests.find(item => item.id === over.id);

      if (!activeInterest || !overInterest) return

      const oldIndex = interests.findIndex(item => item.id === active.id);
      const newIndex = interests.findIndex(item => item.id === over.id);
      if (dragTimeout) clearTimeout(dragTimeout);
      dragTimeout = setTimeout(() => {
        setInterests((items) => {
          return arrayMove(items, oldIndex, newIndex);
        });
      }, 100)
    }
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}>
        <div className='space-y-6 h-full'>
            <div className=''>
                <div className='grid grid-cols-3 space-x-10 px-8 py-16'>
                    <div className='shrink-0'>
                        <div className=' mb-1'>Hobbies & Interests</div>
                        <div className='text-sm text-gray-400'>
                            Add any hobbies you have such as playing guitar, cooking, or reading. Or interests and causes such as climate change, mental health, or politics.
                        </div>
                    </div>

                    <div className='col-span-2'>
                        <SearchList
                            label="interests"
                            interests={interests}
                            addInterest={async (name) => {
                                addInterestMutation.mutate(name)
                            }}
                            isAdding={addInterestMutation.isLoading || (interestsQuery.isSuccess && interestsQuery.isLoading)}
                            toggleInterest={async (id) => {
                                await toggleInterestMutation.mutateAsync(id)
                            }}
                        />

                        {!interestsQuery.isSuccess &&
                            <div className='text-white text-opacity-30 text-sm'>Loading...</div>
                        }
                    </div>
                </div>
            </div>
        </div>
        </DndContext>
    )
}


const SearchList = ({ addInterest, toggleInterest, interests, label = "skills", isAdding }: { interests: (UserInterest & { interest: Interest })[], addInterest: (name: string) => Promise<void>, toggleInterest: (id: number) => Promise<void>, label?: string, isAdding: boolean }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [focused, setFocused] = useState(false);
    const [search, setSearch] = useState('');
    const skillSearchQuery = api.post.searchInterests.useQuery({ search, exclude: interests.map(skill => skill.id), limit: 20 });

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
                    placeholder={`Search ${label}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-full bg-black bg-opacity-5 border border-white border-opacity-10 rounded px-2 py-1 text-sm text-white text-opacity-80'
                    onFocus={() => setFocused(true)}
                />
                {focused && (
                    <div className='absolute top-full left-0 w-full bg-gray-800 text-xs rounded-b z-10'>
                        {skillSearchQuery.data?.map(skill => (
                            <div
                                key={skill.id}
                                onClick={() => {
                                    setFocused(false);
                                    void toggleInterest(skill.id);
                                }}
                                className='px-2 py-1 hover:bg-white hover:bg-opacity-5 cursor-pointer'>
                                {skill.image ? `${skill.image} ${skill.name}` : skill.name}
                            </div>
                        ))}
                        {search && !skillSearchQuery.data?.find(s => s.name?.toLowerCase() === search.toLowerCase()) &&
                            <div
                                onClick={async () => {
                                    await addInterest(search);
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
            <SortableContext 
              items={interests}
              strategy={verticalListSortingStrategy}>
              <div className='flex mt-2 flex-wrap gap-2'>
                  {interests.map(skill => (
                      <Interest key={skill.id} interest={skill} toggleInterest={toggleInterest} />
                  ))}
                  {isAdding &&
                  <div className='border border-white border-opacity-20 w-[100px] animate-pulse h-6 rounded-full bg-white bg-opacity-5'>
                  </div>
                  }
              </div>
            </SortableContext>
        </div>
    );
}

const Interest = ({ interest, toggleInterest }: { interest: (UserInterest & { interest: Interest }), toggleInterest: (id: number) => Promise<void> }) => {
    const [removing, setRemoving] = useState(false);
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: interest.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className='cursor-pointer flex items-center hover:opacity-50 space-x-2 border border-white border-opacity-20 px-2 py-1 rounded-full text-white text-opacity-70 bg-white bg-opacity-5 text-xs'>
            <div 
              {...attributes} 
              {...listeners}
              className='cursor-move p-1'>
              <Bars3Icon className='w-3 h-3' />
            </div>
            {removing 
              ? 'Removing...'
              : (
              <div 
                onClick={async () => {
                  setRemoving(true);
                  await toggleInterest(interest.id);
                }}>
                {interest.interest.image ? `${interest.interest.image} ${interest.interest.name}` : interest.interest.name}
              </div>
              )
            }
        </div>
    )
}

export default Skills
