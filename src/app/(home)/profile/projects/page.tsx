"use client";

import React from "react";
import {
  type Skill,
  type Project,
  type User,
  type UserProject,
} from "@prisma/client";
import classNames from "classnames";
import Image from "next/image";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";
import SkillList from "../skills/SkillList";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/20/solid";

const Projects = () => {
  const [projects, setProjects] = React.useState<(UserProject & { project: (Project & { skills: Skill[]; users: (UserProject & { user: User })[] })})[]>([]);
  const projectsQuery = api.post.fetchProjects.useQuery(undefined, {
    onSuccess: (data) => {
      console.log(data)
      setProjects(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    },
  });
  const createProjectMutation = api.post.createProject.useMutation({
    onSuccess: () => {
      void projectsQuery.refetch();
    },
  });
  const updateOrderMutation = api.post.updateProjectOrder.useMutation({
    onSuccess: () => {
      void projectsQuery.refetch();
    },
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setProjects((projects) => {
        const oldIndex = projects.findIndex(
          (project) => project.project.id === active.id,
        );
        const newIndex = projects.findIndex(
          (project) => project.project.id === over.id,
        );
        const newProjects = arrayMove(projects, oldIndex, newIndex);
        updateOrderMutation.mutate(newProjects.map((p, i) => ({ id: p.id, order: i })))
        console.log(newProjects, 'new projects')
        return newProjects
      });
    }
  }
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className=" font-bold">Projects</h1>
        <button
          className="rounded-lg bg-white px-2 py-1 text-sm text-black"
          onClick={() => createProjectMutation.mutate()}
        >
          {createProjectMutation.isLoading ? "One moment..." : "Add Project"}
        </button>
      </div>
      {projectsQuery.isLoading
      ? (
        <div>Loading...</div>
      )
      : (
      <div>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center rounded-lg border border-dashed border-white border-opacity-10 bg-white bg-opacity-5 py-20">
            <div className="text-sm opacity-60">{"No projects"}</div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={projects}
                strategy={verticalListSortingStrategy}>
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project.project} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
      )
    }
    </div>
  );
};

const ProjectCard = ({
  project,
}: {
  project: Project & {
    skills: Skill[];
    users: (UserProject & { user: User })[];
  };
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div className="w-full" ref={setNodeRef} style={style}>
      <div className='mb-2'><Bars3Icon {...attributes} {...listeners} className="h-4 w-4 text-white" /></div>
      <Link href={`/profile/projects/${project.id}`}>
        {project.image ? (
          <Image
            src={project.image}
            width={300}
            height={157.5}
            alt="project image"
            className='h-[157.5px] object-contain'
          />
        ) : (
          <div className="h-[157.5px] rounded border border-dashed border-white border-opacity-10 bg-white/5"></div>
        )}
      </Link>
      {project.name ?? "No Name"}
    </div>
  );
};

export default Projects;
