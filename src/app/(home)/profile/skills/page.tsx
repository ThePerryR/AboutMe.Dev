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

let dragTimeout: NodeJS.Timeout | null = null;
const Skills = () => {
  const [skills, setSkills] = React.useState<(UserSkill & { skill: Skill })[]>([]);
  const skillsQuery = api.post.getSkills.useQuery();
  const addSkillMutation = api.post.addSkill.useMutation({
    onSuccess: () => {
      void skillsQuery.refetch()
    },
  });
  const toggleSkillMutation = api.post.toggleSkill.useMutation({
    onSuccess: () => {
      console.log('suc')
    },
  });
  // function handleDragEnd(event) {
  //   if (event.over && event.over.id === 'droppable') {
  //     setIsDropped(true);
  //   }
  // }

  React.useEffect(() => {
    if (skillsQuery.data) {
      setSkills(skillsQuery.data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }
  }, [skillsQuery.data])

  const updateSkillOrderMutation = api.post.updateSkillOrder.useMutation()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  function handleDragEnd (event: DragEndEvent) {
    const {active, over} = event;
    
    if (over && active.id !== over.id) {
      setSkills((skills) => {
        const oldIndex = skills.findIndex(s => s.id === active.id);
        const newIndex = skills.findIndex(s => s.id === over.id);
        
        const s = arrayMove(skills, oldIndex, newIndex);
        return s.map((sk, i) => ({ ...sk, order: i }))
      });
    }
    setTimeout(() => {
      updateSkillOrderMutation.mutate(skills.map((sk, i) => ({ ...sk, order: i })))
    }, 500)
  }
  function handleDragOver (event: DragEndEvent) {
    const {active, over} = event;
    if (!over || active.id === over.id) return;
    const activeSkill = skills.find(s => s.id === active.id);
    const overSkill = skills.find(s => s.id === over.id);

    if (!activeSkill || !overSkill) return

    if (activeSkill.primary && !overSkill.primary) {
      setSkills((skills) => {
        const s = [...skills];
        const ns = s.find(s => s.id === active.id)
        if (!ns) return s
        ns.primary = false;
        return s.map((sk, i) => ({ ...sk, order: i }))
      })
    } else if (!activeSkill.primary && overSkill.primary) {
      setSkills((skills) => {
        const s = [...skills];
        const ns = s.find(s => s.id === active.id)
        if (!ns) return s
        ns.primary = true;
        return s.map((sk, i) => ({ ...sk, order: i }))
      })
    } else {
      const oldIndex = skills.findIndex(s => s.id === active.id);
      const newIndex = skills.findIndex(s => s.id === over.id);
      if (dragTimeout) clearTimeout(dragTimeout);
      dragTimeout = setTimeout(() => {
        setSkills((skills) => {
          const s = arrayMove(skills, oldIndex, newIndex);
          return s.map((sk, i) => ({ ...sk, order: i }))
        });
      }, 100)
    }
  }
  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}>
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
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map(s => s.skill)
              }
              toggleSkill={async (id) => {
                await toggleSkillMutation.mutateAsync({ id, primary: true });
                void skillsQuery.refetch()
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
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map(s => s.skill)
              }
              toggleSkill={async (id) => {
                await toggleSkillMutation.mutateAsync({ id, primary: false });
                void skillsQuery.refetch()
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
