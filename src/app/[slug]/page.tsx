import { type Skill, User, Project } from "@prisma/client";
import classNames from "classnames";
import { type Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import GitHubCalendar from "react-github-calendar";
import PDFDocument from "pdfkit";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Calendar from "./Calendar";
import SkillShow from "./Skill";
import SkillSection from "./SkillSection";
import MoreProjects from "./MoreProjects";
import BottomBar from "./BottomBar";
import ProjectCard from "./ProjectCard";

async function fetchGithubData(
  user: { username: string | null } | null,
  username: string,
) {
  if (user !== null) {
    return;
  }
  const res = await fetch(`https://api.github.com/users/${username}`);
  const data = (await res.json()) as {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: boolean;
    bio: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
  };
  return data;
}

/*
                        <option value='us'>United States</option>
                        <option value='ca'>Canada</option>
                        <option value='sa'>Latin America & Caribbean</option>
                        <option value='eu'>Europe</option>
                        <option value='ap'>Asia Pacific</option>
                        <option value='me'>Middle East & Africa</option>
                        <option value='oc'>Oceania</option>
                        <option value='other'>Other</option>
                        */

const regionLabels = {
  us: "United States",
  ca: "Canada",
  sa: "Latin America & Caribbean",
  eu: "Europe",
  ap: "Asia Pacific",
  me: "Middle East & Africa",
  oc: "Oceania",
  other: "Other",
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const userQuery = await api.post.fetchUser.query(params.slug);
  const githubData = await fetchGithubData(userQuery, params.slug);
  return {
    title: `${userQuery?.name ?? githubData?.name ?? "AboutMe.dev"} - @${params.slug}`,
    // fancy formatted description
    description: `@${params.slug} is a developer from ${userQuery?.location ?? githubData?.location ?? "somewhere"} who works with ${userQuery?.skills
      .filter((skill) => skill.primary)
      .map((skill) => skill.name)
      .join(", ")}.`,
  };
}

function addHttpsToUrlIfNeeded(url: string) {
  if (!url) return "";
  if (!url.startsWith("http")) {
    return `https://${url}`;
  }
  return url;
}

const UserPage = async ({ params }: { params: { slug: string } }) => {
  const userQuery = await api.post.fetchUser.query(params.slug);
  const githubData = await fetchGithubData(userQuery, params.slug);

  if (userQuery === null && githubData === undefined) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-col items-center bg-[#0A0A0A] px-6 py-4 text-white sm:py-10">
      <div className="mb-4 flex w-full max-w-[844px] flex-col justify-between sm:mb-8 sm:flex-row">
        <div className="mb-4 flex flex-col items-start sm:mb-0 sm:flex-row sm:items-center">
          {/* User's Picture */}
          <div className="relative">
            <Image
              src={
                userQuery?.image ?? githubData?.avatar_url ?? "/no-picture.jpg"
              }
              alt="avatar"
              width={120}
              height={120}
              className="h-[120px] w-[120px] rounded sm:h-[100px] sm:w-[100px]"
            />
            {userQuery?.statusEmoji && (
              <div className="absolute bottom-[-8px] right-[-8px] flex h-[28px] w-[28px] rotate-[-6deg] cursor-default items-center justify-center rounded-full bg-[#ececec] bg-opacity-0 text-[26px] text-opacity-100">
                {userQuery.statusEmoji}
              </div>
            )}
          </div>
          <div className="mt-2 sm:ml-4 sm:mt-0">
            {/* Name */}
            <div className="flex">
              <h1
                className={classNames(
                  "mb-1 text-2xl font-bold sm:text-4xl ",
                  userQuery?.name ?? githubData?.name
                    ? "opacity-90"
                    : "opacity-50",
                )}>
                {userQuery?.name ?? githubData?.name ?? "No name"}
              </h1>
              {userQuery?.nationalityEmoji && (
                <div className="ml-2">
                  <span>{userQuery.nationalityEmoji}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-6">
              {/* Region */}
              {userQuery?.region && (
                <div className="flex items-center space-x-1 opacity-70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                  <span>
                    {
                      regionLabels[
                        userQuery.region as keyof typeof regionLabels
                      ]
                    }
                  </span>
                </div>
              )}
              {/* Location */}
              <div
                className={classNames(
                  "flex items-center space-x-0.5 opacity-70",
                  {
                    "opacity-40": !(
                      userQuery?.location ?? githubData?.location
                    ),
                  },
                )}>
                <svg
                  className="h-[15px] w-[15px]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span>
                  {userQuery?.location ?? githubData?.location ?? "No location"}
                </span>
              </div>
              {/* Website */}
              {(userQuery?.website ?? githubData?.blog) && (
                <Link
                  href={addHttpsToUrlIfNeeded(
                    userQuery?.website ?? githubData?.blog ?? "",
                  )}
                  target="_blank"
                  className="opacity-90 hover:opacity-100">
                  <div
                    className={classNames(
                      "flex items-center space-x-1 opacity-100",
                      {
                        "opacity-40": !(
                          userQuery?.location ?? githubData?.location
                        ),
                      },
                    )}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-4 w-4">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                      />
                    </svg>

                    <span>Website</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="sm:gapy-y-1 flex flex-row flex-wrap gap-x-4 gap-y-2 sm:flex-col">
          <div>
            <Link
              target="_blank"
              href={`https://github.com/${params.slug}`}
              className="opacity-90 hover:opacity-100">
              <div className="flex items-center">
                <div className="w-5 sm:w-7">
                  <svg
                    width="33"
                    height="32"
                    className="h-4 w-4"
                    viewBox="0 0 33 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.2847 0C7.27967 0 0 7.33333 0 16.4057C0 23.6577 4.66433 29.7963 11.135 31.969C11.944 32.1323 12.2403 31.616 12.2403 31.1817C12.2403 30.8013 12.2137 29.4977 12.2137 28.1393C7.68367 29.1173 6.74033 26.1837 6.74033 26.1837C6.01233 24.2823 4.93367 23.7937 4.93367 23.7937C3.451 22.7887 5.04167 22.7887 5.04167 22.7887C6.68633 22.8973 7.54933 24.4727 7.54933 24.4727C9.005 26.9713 11.3507 26.2653 12.2943 25.8307C12.429 24.7713 12.8607 24.038 13.319 23.6307C9.706 23.2503 5.90467 21.838 5.90467 15.5363C5.90467 13.7437 6.55133 12.277 7.576 11.1363C7.41433 10.729 6.848 9.04467 7.738 6.79033C7.738 6.79033 9.113 6.35567 12.2133 8.47433C13.5407 8.11522 14.9096 7.93254 16.2847 7.931C17.6597 7.931 19.0613 8.12133 20.3557 8.47433C23.4563 6.35567 24.8313 6.79033 24.8313 6.79033C25.7213 9.04467 25.1547 10.729 24.993 11.1363C26.0447 12.277 26.6647 13.7437 26.6647 15.5363C26.6647 21.838 22.8633 23.223 19.2233 23.6307C19.8167 24.1467 20.3287 25.1243 20.3287 26.6727C20.3287 28.8727 20.302 30.6383 20.302 31.1813C20.302 31.616 20.5987 32.1323 21.4073 31.9693C27.878 29.796 32.5423 23.6577 32.5423 16.4057C32.569 7.33333 25.2627 0 16.2847 0Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div className="opacity-80">{params.slug}</div>
              </div>
            </Link>
            {(userQuery?.githubCreatedAt ?? githubData?.created_at) && (
              <div className="mt-0 text-xs text-white text-opacity-50">
                Created{" "}
                {(
                  userQuery?.githubCreatedAt ??
                  new Date(githubData?.created_at ?? "")
                ).toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
          </div>
          {userQuery?.twitterUsername && (
            <div>
              <Link
                target="_blank"
                href={`https://x.com/${userQuery?.twitterUsername}`}
                className="opacity-90 hover:opacity-100">
                <div className="flex items-center">
                  <div className="w-5 sm:w-7">𝕏</div>
                  <div className="opacity-80">{userQuery?.twitterUsername}</div>
                </div>
              </Link>
            </div>
          )}
          {userQuery?.linkedinUsername && (
            <div>
              <Link
                target="_blank"
                href={`https://linkedin.com/in/${userQuery.linkedinUsername}`}
                className="opacity-90 hover:opacity-100">
                <div className="flex items-center">
                  <div className="w-5 sm:w-7">
                    <svg
                      width="32"
                      height="32"
                      className="h-[15px] w-[15px]"
                      viewBox="0 0 72 72"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M64 72H8C3.58172 72 0 68.4183 0 64V8C0 3.58172 3.58172 0 8 0H64C68.4183 0 72 3.58172 72 8V64C72 68.4183 68.4183 72 64 72ZM51.3156 62H62V40.0512C62 30.7645 56.7357 26.2742 49.3826 26.2742C42.026 26.2742 38.9301 32.0029 38.9301 32.0029V27.3333H28.6333V62H38.9301V43.8021C38.9301 38.9261 41.1746 36.0245 45.4707 36.0245C49.4198 36.0245 51.3156 38.8128 51.3156 43.8021V62ZM10 16.397C10 19.9297 12.8421 22.794 16.3493 22.794C19.8566 22.794 22.697 19.9297 22.697 16.397C22.697 12.8644 19.8566 10 16.3493 10C12.8421 10 10 12.8644 10 16.397ZM21.7694 62H11.0326V27.3333H21.7694V62Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="opacity-80">{userQuery.linkedinUsername}</div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="mx-auto w-full max-w-[844px] text-white text-opacity-60">
        <Calendar username={params.slug} />
      </div>

      {userQuery && userQuery.skills.length > 0 && (
        <div className="mt-6 w-full max-w-[844px] sm:mt-8">
          {userQuery.skills.filter((skill) => skill.primary).length > 0 && (
            <>
              <div className="mb-2 text-sm opacity-70">Current Stack</div>
              <div className="mb-0 flex flex-wrap items-center gap-x-2 gap-y-1">
                {userQuery.skills
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .filter((skill) => skill.primary)
                  .map((skill) => {
                    return (
                      <div
                        key={skill.id}
                        className="mb-2 flex h-9 items-center justify-between rounded-full border border-white border-opacity-20 px-2 py-1">
                        {skill.image && (
                          <Image
                            src={skill.image}
                            alt="skill"
                            width={20}
                            height={20}
                            className=""
                          />
                        )}
                        <div className="mx-2 text-sm opacity-90">
                          {skill.name}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
          <SkillSection
            forceOpen={
              userQuery.skills.filter((skill) => skill.primary).length === 0
            }
            skills={userQuery.skills
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .filter((skill) => !skill.primary)}
          />

          {userQuery.projects.length > 0 && (
            <>
              <div className="mb-2 mt-10 text-sm opacity-70 sm:mt-12">
                Projects
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
                {userQuery.projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 6).map((project) => {
                  return <ProjectCard key={project.id} project={project} />;
                })}
              </div>
              {userQuery.projects.length > 6 && (
                <MoreProjects projects={userQuery.projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(6)} />
              )}
            </>
          )}

          {userQuery.experiences.length > 0 && (
            <>
              <div
                className={classNames(
                  "mb-2 mt-2 text-sm opacity-70",
                  userQuery.projects.length > 6 ? "sm:mt-16" : "sm:mt-8",
                )}
              >
                Experience
              </div>
              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8">
                {userQuery.experiences.sort((a, b) => (b.startDate ? b.startDate.getTime() : 0) - (a.startDate ? a.startDate.getTime() : 0)).map((experience) => {
                  const years =
                    experience.isCurrent && experience.startDate
                      ? new Date().getFullYear() -
                        experience.startDate.getFullYear()
                      : experience.endDate && experience.startDate
                        ? experience.endDate.getFullYear() -
                          experience.startDate.getFullYear()
                        : undefined;
                  return (
                    <div
                      key={experience.id}
                      className={classNames(
                        "flex flex-col rounded border border-white border-opacity-20 p-2 pl-4",
                        experience.isCurrent ? "sm:col-span-2" : "col-span-2",
                      )}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {experience.companyLogo && (
                            <Image
                              src={experience.companyLogo}
                              alt="experience"
                              width={200}
                              height={56}
                              className="h-[24px] w-auto"
                            />
                          )}
                        </div>
                        <div className="flex flex-col justify-end text-right">
                          <div className="text-sm opacity-80">
                            {experience.company}
                          </div>
                          <div className="text-sm opacity-50">
                            {experience.role}
                          </div>
                          <div className="text-sm opacity-50">
                            {experience.startDate
                              ? experience.startDate.toLocaleDateString(
                                  "en-us",
                                  { year: "numeric", month: "short" },
                                )
                              : ""}
                            {experience.startDate &&
                            (experience.endDate ?? experience.isCurrent)
                              ? " - "
                              : ""}
                            {experience.isCurrent
                              ? "Present"
                              : experience.endDate
                                ? experience.endDate.toLocaleDateString(
                                    "en-us",
                                    { year: "numeric", month: "short" },
                                  )
                                : ""}
                            &nbsp;{years !== undefined && `(${years} yrs)`}
                          </div>
                        </div>
                      </div>

                      {experience.description && (
                        <div className="pb-1 pt-2 text-sm text-white text-opacity-60">
                          {experience.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {userQuery.interests.length > 0 && (
            <>
              <div className="mb-2 mt-10 text-sm opacity-70">
                Hobbies, Interests, & Causes
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 sm:gap-y-2">
                {userQuery.interests.map((skill) => {
                  return (
                    <div
                      key={skill.id}
                      className="mb-2 flex h-9 items-center  justify-between border border-none"
                    >
                      {skill.image && <div>{skill.image}</div>}
                      <div className="mx-2 text-sm opacity-90">
                        {skill.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <BottomBar username={params.slug} />
        </div>
      )}
    </div>
  );
};

export default UserPage;
