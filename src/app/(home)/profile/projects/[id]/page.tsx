'use client'

import { type Project, type Skill, type User, type UserProject } from '@prisma/client';
import Image from 'next/image';
import React from 'react'
import { api } from '~/trpc/react';
import { UploadButton } from '~/utils/uploadthing';
import SkillList from '../../skills/SkillList';
import Link from 'next/link';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import classNames from 'classnames';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const project = api.post.fetchProject.useQuery(Number(params.id));
  const toggleFavorite = () => {
    void project.refetch();
  };
  const refresh = () => {
    void project.refetch();
  };
  if (!project.isSuccess) return <div>Loading...</div>;
  if (!project.data) return <div>Not Found</div>
  return (
    <ProjectCard project={project.data} canFavorite={true} toggleFavorite={toggleFavorite} refresh={refresh} />
  );
}

const ProjectCard = ({ project, canFavorite, toggleFavorite, refresh }: { project: Project & { skills: Skill[]; users: (UserProject & { user: User })[]; }, canFavorite: boolean, toggleFavorite: () => void, refresh: () => void }) => {
  const [name, setName] = React.useState(project.name);
  const [url, setUrl] = React.useState(project.url);
  const [status, setStatus] = React.useState(project.status);
  const [headline, setHeadline] = React.useState(project.headline);
  const [description, setDescription] = React.useState(project.description);
  const [skills, setSkills] = React.useState(project.skills);
  const [newUserName, setNewUserName] = React.useState("");

  const [image, setImage] = React.useState(project.image);
  const [isFavorited, setIsFavorited] = React.useState(project.isFavorited);

  const canSave =
    name !== project.name ||
    url !== project.url ||
    status !== project.status ||
    headline !== project.headline ||
    image !== project.image ||
    description !== project.description;
  const updateProjectMutation = api.post.updateProject.useMutation({});
  const deleteProjectMutation = api.post.deleteProject.useMutation({
    onSuccess: () => {
      toggleFavorite();
    },
  });
  const toggleProjectFavoriteMutation =
    api.post.toggleProjectFavorite.useMutation({
      onSuccess: () => {
        toggleFavorite();
      },
    });
  const addSkillMutation = api.post.addSkill.useMutation({
    onSuccess: (skill) => {
      if ("skill" in skill) return;
      setSkills([...skills, skill]);
    },
  });
  const toggleSkillMutation = api.post.toggleSkill.useMutation({
    onSuccess: (skills) => {
      console.log(111, skills);
      setSkills(skills);
    },
  });

  const addUserToProjectMutation = api.post.addUserToProject.useMutation({
    onSuccess: (user) => {
      refresh();
    },
  });
  function handleClickAddUser() {
    addUserToProjectMutation.mutate({
      projectId: project.id,
      username: newUserName,
    });
    setNewUserName("");
  }
  const removeUserFromProjectMutation =
    api.post.removeUserFromProject.useMutation({
      onSuccess: () => {
        refresh();
      },
    });
  const generateExperienceHeadline = api.post.generateExperienceHeadline.useMutation({
    onSuccess: (hl) => {
      if (!headline) {
        setHeadline(hl)
      } 
    }
  })
  const generateExperienceDescription = api.post.generateExperienceDescription.useMutation({
    onSuccess: (desc) => {
      setDescription(desc)
    }
  })
  return (
    <div className="py-8 px-4">
      <div>
        <Link href='/profile/projects'>
          <div className='text-sm flex items-center cursor-pointer opacity-70 hover:opacity-100 mb-8'>
            <ChevronLeftIcon className='w-5 h-5' /> Back to projects
          </div>
        </Link>
      </div>
      <div key={project.id} className="flex flex-col space-y-4 p-4">
        <div className="grid grid-cols-3">
          <div className="mb-1 text-sm">Name</div>
          <div className="col-span-2">
            <input
              type="text"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-white/10 bg-white/5 p-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="mb-1 text-sm">URL</div>
          <div className="col-span-2">
            <input
              type="text"
              value={url ?? ""}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => {
                if (url) {
                  generateExperienceHeadline.mutate({
                    name: name ?? '',
                    url,
                  })
                }
              }}
              className="w-full rounded border border-white/10 bg-white/5 p-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="mb-1 text-sm">Headline</div>
          <div className="col-span-2">
            <input
              type="text"
              value={headline ?? ""}
              placeholder={generateExperienceHeadline.isLoading ? 'Generating...' : '"Recipe app for busy people"'}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full rounded border border-white/10 bg-white/5 p-2 placeholder:opacity-30"
            />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="mb-1 text-sm">Description</div>
          <div className="col-span-2">
            <textarea
              rows={6}
              value={description ?? ""}
              placeholder=""
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-white/10 bg-white/5 p-2 placeholder:opacity-30"
            />
            <div 
              onClick={() => generateExperienceDescription.mutate({
                name: name ?? '',
                headline: headline ?? '',
                description: description ?? '',
              })}
              className='text-xs flex text-blue-500 cursor-pointer opacity-80 hover:opacity-100'>
              {generateExperienceDescription.isLoading
              ? <div className='opacity-40'>Generating...</div>
              : !description
                ? <div className=''>✨ Generate Description</div>
                : <div className=''>✨ Improve Description</div>
              }
            </div>
          </div>
        </div>
        {/* <div className='flex'>
                    <div className='text-sm mb-1 w-[120px]'>Description</div>
                    <textarea
                        value={description ?? ''}
                        onChange={(e) => setDescription(e.target.value)}
                        className='bg-transparent placeholder:opacity-30 border-white border rounded border-opacity-10 p-2 w-full'
                    />
                </div> */}
        <div className="grid grid-cols-3">
          <div className="mb-1 text-sm">Status</div>
          <div className="col-span-2">
            <select
              value={status ?? ""}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded border border-white/10 bg-white/5 p-2"
            >
              <option value="">Select...</option>
              <option value="idea">Idea</option>
              <option value="in-progress">In Progress</option>
              <option value="live-beta">Live - Beta</option>
              <option value="live">Live</option>
              <option value="paused">Paused</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div>
            <div className="mb-1 text-sm">Image</div>
            <div className="mb-2 text-xs opacity-60">
              Upload a cover image for your project. Recommended size is
              1200x630
            </div>
          </div>
          <div className="col-span-2 flex space-x-6">
            <div className="flex h-[157.5px] flex-1 items-center justify-center rounded border border-white border-opacity-10">
              {image !== null ? (
                <Image
                  src={image}
                  width={300}
                  height={157.5}
                  alt="image preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="opacity-30">No images</div>
              )}
            </div>
            <div className="flex items-center pr-3">
              <UploadButton
                endpoint="projectImage"
                input={{ projectId: project.id }}
                className=""
                appearance={{
                  button: (args) =>
                    `bg-white text-black h-6 text-sm px-2 w-auto`,
                }}
                onUploadBegin={() => {
                  // setUploadError(undefined)
                }}
                onClientUploadComplete={(res) => {
                  setImage(res[0]?.url ?? null);
                }}
                onUploadError={(error: Error) => {
                  // setUploadError('Invalid image. Max size is 4MB')
                }}
              />
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-3">
          <div className="flex flex-col items-start">
            <div className="mb-1 text-sm">Skills</div>
            <div className="text-xs opacity-60">
              List the technologies and tools used in this project.
            </div>
          </div>
          <div className="col-span-2">
            <SkillList
              allSkills={skills}
              skills={skills}
              toggleSkill={async (id) => {
                await toggleSkillMutation.mutateAsync({
                  id,
                  projectId: project.id,
                });
              }}
              addSkill={async (name) => {
                await addSkillMutation.mutateAsync({
                  name,
                  type: "language",
                  projectId: project.id,
                });
              }}
            />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-3">
            <div>Users</div>

            <div className="col-span-2">
              <input
                className="w-full rounded border border-white/10 bg-white/5 p-2"
                placeholder="Add user by username"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClickAddUser();
                  }
                }}
              />
              <div className='mt-2 w-full space-y-2'>
                {project.users.length === 0 &&
                <div className="text-xs opacity-60">No users</div>
                }
                {project.users.map((user) => (
                  <div
                    key={user.user.username}
                    className="flex items-center space-x-4">
                    <Link href={`/${user.user.username}`} className='flex items-center space-x-2'>
                      <Image src={user.user.image ?? ''} alt='' width={24} height={24} className='rounded-full' />
                      <div className='text-sm'>{user.user.name}</div>
                    </Link>
                    <div
                      className="cursor-pointer text-xs text-red-500"
                      onClick={() => {
                        removeUserFromProjectMutation.mutate({
                          projectId: project.id,
                          userId: user.user.id,
                        });
                      }}>
                      Remove
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-4">
        <Tooltip.Provider
          delayDuration={!isFavorited && !canFavorite ? 100 : 500}
        >
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div
                className={classNames(
                  "group",
                  !canFavorite && !isFavorited
                    ? "cursor-not-allowed"
                    : "cursor-pointer",
                  { "opacity-50": !canFavorite && !isFavorited },
                )}
                onClick={() => {
                  if (!isFavorited && !canFavorite) return;
                  toggleProjectFavoriteMutation.mutate(project.id);
                  setIsFavorited(!isFavorited);
                }}
              >
                {isFavorited ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 text-blue-500 group-hover:hidden"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="hidden h-6 w-6 text-blue-500 group-hover:flex"
                    >
                      <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM20.25 5.507v11.561L5.853 2.671c.15-.043.306-.075.467-.094a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93ZM3.75 21V6.932l14.063 14.063L12 18.088l-7.165 3.583A.75.75 0 0 1 3.75 21Z" />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className={classNames(
                        "h-6 w-6",
                        canFavorite ? "group-hover:hidden" : "",
                      )}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={classNames(
                        "hidden h-6 w-6",
                        canFavorite ? "group-hover:flex" : "",
                      )}
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-white">
                <div className="p-2 text-xs">
                  {isFavorited
                    ? "Unfavorite"
                    : canFavorite
                      ? "Favorite"
                      : "You can only favorite 6 projects"}
                </div>
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
        <div className="flex items-center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="mr-2 px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="rounded bg-white py-2">
                <DropdownMenu.Item
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this project?")
                    ) {
                      deleteProjectMutation.mutate(project.id);
                    }
                  }}
                  className="flex h-8 cursor-pointer items-center px-3 text-sm font-medium text-red-500 hover:bg-gray-200"
                >
                  <div>Delete Project</div>
                </DropdownMenu.Item>
                <DropdownMenu.Arrow className="fill-white" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <div
            onClick={async () => {
              updateProjectMutation.mutate({
                id: project.id,
                name: name ?? undefined,
                url: url ?? undefined,
                status: status ?? undefined,
                headline: headline ?? undefined,
                description: description ?? undefined,
              });
            }}
            className={classNames(
              "flex h-8 w-auto items-center rounded px-2 text-sm",
              canSave || updateProjectMutation.isLoading
                ? "cursor-pointer bg-white text-black"
                : "border border-white border-opacity-5 bg-gray-600 bg-opacity-20 text-white text-opacity-20",
            )}
          >
            {updateProjectMutation.isLoading ? "Saving..." : "Save"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
