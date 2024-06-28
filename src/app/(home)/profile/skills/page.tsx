"use client";

import React from "react";
import SkillList from "./SkillList";
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
} from '@dnd-kit/sortable';
import { api } from "~/trpc/react";
import { type Skill, type UserSkill } from "@prisma/client";

const Skills = () => {
  const [skills, setSkills] = React.useState<(UserSkill & { skill: Skill })[]>([]);
  const skillsQuery = api.post.getSkills.useQuery();
  const addSkillMutation = api.post.addSkill.useMutation({
    onSuccess: () => {
      void skillsQuery.refetch();
    },
  });
  const toggleSkillMutation = api.post.toggleSkill.useMutation({
    onSuccess: () => {
      void skillsQuery.refetch();
    },
  });
  // function handleDragEnd(event) {
  //   if (event.over && event.over.id === 'droppable') {
  //     setIsDropped(true);
  //   }
  // }

  React.useEffect(() => {
    if (skillsQuery.data) {
      setSkills(skillsQuery.data);
    }
  }, [skillsQuery.data])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  function handleDragEnd (event: DragEndEvent) {
    const {active, over} = event;
    
    if (over && active.id !== over.id) {
      // setItems((items) => {
      //   const oldIndex = items.indexOf(active.id);
      //   const newIndex = items.indexOf(over.id);
        
      //   return arrayMove(items, oldIndex, newIndex);
      // });
    }
  }
  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 space-x-10 border-b border-[#1C2432] px-8 py-16">
          <div className="flex shrink-0 flex-col items-start">
            <div className="mb-1 font-medium">Primary Stack</div>
            <div className="text-sm opacity-60">
              Add the languages and frameworks that you primarily use.
            </div>
          </div>

          <div className="col-span-2">
            <SkillList
              primary
              allSkills={skills.map((skill) => skill.skill)}
              skills={
                skills
                  ?.filter((skill) => skill.primary)
                  .map((skill) => skill.skill) ?? []
              }
              toggleSkill={async (id) => {
                await toggleSkillMutation.mutateAsync({ id, primary: true });
              }}
              addSkill={async (name) => {
                await addSkillMutation.mutateAsync({
                  name,
                  type: "language",
                  primary: true,
                });
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 space-x-10 border-b border-[#1C2432] px-8 py-16">
          <div className="flex shrink-0 flex-col items-start">
            <div className="text-sm mb-1">Other Skills</div>
            <div className="text-sm text-gray-400">
              Add any other languages, libraries, frameworks, or tools you know.
            </div>
          </div>

          <div className="col-span-2">
            <SkillList
              allSkills={skills.map((skill) => skill.skill)}
              skills={
                skills
                  ?.filter((skill) => !skill.primary)
                  .map((skill) => skill.skill) ?? []
              }
              toggleSkill={async (id) => {
                await toggleSkillMutation.mutateAsync({ id, primary: false });
              }}
              addSkill={async (name) => {
                await addSkillMutation.mutateAsync({
                  name,
                  type: "",
                  primary: false,
                });
              }}
            />
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default Skills;
