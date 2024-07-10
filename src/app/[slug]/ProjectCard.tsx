import Image from "next/image";
import Link from "next/link";
import React from "react";
import SkillShow from "./Skill";
import { type Skill } from "@prisma/client";

const ProjectCard = ({ project }: { project: { id: number, name: string | null, headline: string | null, image: string | null, url: string | null, status: string | null, skills: { id: number; name: string | null; type: string | null; image: string | null; }[] }}) => {
  return (
    <div key={project.id} className="flex  flex-col rounded border-opacity-10">
      {project.image ? (
        project.url ? (
          <Link href={`/project/${project.id}`} target="_blank">
            <Image
              src={project.image ?? ""}
              alt="project"
              width={600}
              height={315}
              className="mb-2 aspect-[1200/630] rounded object-cover"
            />
          </Link>
        ) : (
          <Image
            src={project.image ?? ""}
            alt="project"
            width={600}
            height={315}
            className="mb-2 aspect-[1200/630] rounded object-cover"
          />
        )
      ) : project.url ? (
        <Link href={`/project/${project.id}`} target="_blank">
          <div className="mb-2 aspect-[1200/630] rounded border border-dashed border-white border-opacity-20 bg-white bg-opacity-5 opacity-80" />
        </Link>
      ) : (
        <div className="mb-2 aspect-[1200/630] rounded border border-dashed border-white border-opacity-20 bg-white bg-opacity-5 opacity-80" />
      )}
      <div className="mb-2 flex items-center justify-between">
        {project.url ? (
          <Link
            href={`/project/${project.id}`}
            target="_blank"
            className="flex items-center"
          >
            <div className="text-sm opacity-80">{project.name}</div>
          </Link>
        ) : (
          <div className="text-sm opacity-100">{project.name}</div>
        )}
        {project.status === "live" && (
          <div className="rounded-full bg-green-500 px-2 text-[12px] text-black">
            Live
          </div>
        )}
        {project.status === "live-beta" && (
          <div className="rounded-full bg-blue-500 px-2 text-[12px] text-black">
            Beta
          </div>
        )}
        {project.status === "in-progress" && (
          <div className="rounded-full bg-yellow-500 px-2 text-[12px] text-black">
            In Progress
          </div>
        )}
        {project.status === "idea" && (
          <div className="rounded-full bg-gray-500 px-2 text-[12px] text-black">
            Idea
          </div>
        )}
        {project.status === "paused" && (
          <div className="rounded-full bg-gray-500 px-2 text-[12px] text-black">
            Paused
          </div>
        )}
        {project.status === "inactive" && (
          <div className="rounded-full bg-gray-500 px-2 text-[12px] text-black">
            Inactive
          </div>
        )}
      </div>
      <div className="text-sm text-white text-opacity-40">
        {project.headline}
      </div>
      <div className="mt-1 flex justify-between">
        <div className="flex flex-wrap gap-0">
          {project.skills
            .filter((s) => !!s.image && typeof s.image === "string")
            .map((s) => {
              const skill = s as Skill & { image: string };
              return <SkillShow key={skill.id} skill={skill} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
