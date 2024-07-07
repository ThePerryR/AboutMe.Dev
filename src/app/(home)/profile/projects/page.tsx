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

import { api } from "~/trpc/react";
import { UploadButton } from "~/utils/uploadthing";
import SkillList from "../skills/SkillList";
import Link from "next/link";

const Projects = () => {
  const [favoriteCount, setFavoriteCount] = React.useState(0);
  const projects = api.post.fetchProjects.useQuery(undefined, {
    onSuccess: (data) => {
      setFavoriteCount(data.filter((p) => p.isFavorited).length);
    },
  });
  const createProjectMutation = api.post.createProject.useMutation({
    onSuccess: () => {
      void projects.refetch();
    },
  });
  if (!projects.isSuccess) return <div>Loading...</div>;
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
      {projects.data.length === 0 ? (
        <div className="flex flex-col items-center rounded-lg border border-dashed border-white border-opacity-10 bg-white bg-opacity-5 py-20">
          <div className="text-sm opacity-60">{"No projects"}</div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-4">
          {projects.data.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project }: { project: Project & { skills: Skill[], users: (UserProject & { user: User })[] }}) => {
  return (
    <Link href={`/profile/projects/${project.id}`}>
      <div className='w-full'>
        {project.image
        ? <Image src={project.image} width={300} height={157.5} alt='project image' />
        : <div className='h-[157.5px] bg-white/5 rounded border-dashed border border-white border-opacity-10'></div>
        }
        {project.name ?? 'No Name'}
      </div>
    </Link>
  )
}


export default Projects;
