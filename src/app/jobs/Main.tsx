"use client";

import React, { useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LinkIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { api } from "~/trpc/react";
import SkillList from "../(home)/profile/skills/SkillList";
import { User, UserSkill, type Skill } from "@prisma/client";
import { SessionUser } from "./page";
import Image from "next/image";
import { ImageEditor } from "../(home)/teams/[id]/Main";
import Link from "next/link";

const LinkForm = ({
  close,
  refetch,
}: {
  close: () => void;
  refetch: () => void;
}) => {
  const [url, setUrl] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [companyLogo, setCompanyLogo] = React.useState<string | undefined>(undefined);
  const [jobTitle, setJobTitle] = React.useState("");
  const [region, setRegion] = React.useState("us");
  const [location, setLocation] = React.useState("");
  const [allowRemote, setAllowRemote] = React.useState(false);
  const [salaryMin, setSalaryMin] = React.useState("");
  const [salaryMax, setSalaryMax] = React.useState("");
  const [aboutCompany, setAboutCompany] = React.useState("");
  const [aboutTeam, setAboutTeam] = React.useState("");
  const [selectedSkills, setSelectedSkills] = React.useState<(UserSkill & { skill: Skill })[]>([]);

  const parseWebsiteMutation = api.post.parseWebsite.useMutation();

  const skillsQuery = api.post.searchSkills.useQuery({
    search: "",
    exclude: selectedSkills.map((s) => s.id),
  });
  const addSkillMutation = api.post.addSkill.useMutation({
    onSuccess: (skill) => {
      if ('skill' in skill) {
        setSelectedSkills([ ...selectedSkills, skill ]);
      }
    },
  });
  const createJobMutation = api.post.createJob.useMutation({
    onSuccess: (job) => {
      setUrl("");
      setSalaryMin("");
      setSalaryMax("");
      refetch();
    },
  });

  function handleClickSave() {
    createJobMutation.mutate({
      url,
      companyName,
      companyLogo,
      jobTitle,
      region,
      location,
      allowRemote,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
      aboutCompany,
      aboutTeam,
      skills: selectedSkills.map((s) => s.id),
    });
  }

  async function toggleSkill(id: number, skill: Skill) {
    const index = selectedSkills.findIndex((s) => s.id === id);
    if (index === -1) {
      // setSelectedSkills([...selectedSkills, skill]);
    } else {
      setSelectedSkills(selectedSkills.filter((s) => s.id !== id));
    }
  }
  return (
    <div className="space-y-3 text-white">
      <div className="w-full">
        <div className="mb-1 font-medium">Link</div>
        <input
          className="w-full rounded border border-white/10 bg-white/5 p-2 text-sm"
          type="text"
          placeholder="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div>
        <div className="mb-1 font-medium">Company Name</div>
        <input
          className="w-full rounded border border-white/10 bg-white/5 p-2 text-sm"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      <ImageEditor 
        label="Company Logo"
        value={companyLogo}
        handleClickSave={(value) => setCompanyLogo(value)}
      />
      <div>
        <div className="mb-1 font-medium">Job Title</div>
        <input
          className="w-full rounded border border-white/10 bg-white/5 p-2 text-sm"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>
      <div>
        <div className="mb-1 font-medium">Region</div>
        <select
          className="w-full rounded border border-white/10 bg-white/5 p-2 text-sm"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">Select Region</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="sa">Latin America & Caribbean</option>
          <option value="eu">Europe</option>
          <option value="ap">Asia Pacific</option>
          <option value="me">Middle East & Africa</option>
          <option value="oc">Oceania</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <div className="mb-1 font-medium">Location</div>
        <input
          className="w-full rounded border border-white/10 bg-white/5 p-2 text-sm"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          className="mr-1"
          checked={allowRemote}
          onChange={(e) => setAllowRemote(e.target.checked)}
        />
        <div className="text-sm font-medium">Allows Remote</div>
      </div>
      <div>
        <div className="mb-1 font-medium">Salary</div>
        <div className="flex space-x-8">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Min</div>
            <input
              className="w-full rounded border border-white/10 bg-white/5 p-2 text-sm"
              type="number"
              value={salaryMin}
              min={0}
              onChange={(e) => setSalaryMin(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Max</div>
            <input
              className="w-full rounded border border-white/10 bg-white/5 p-2 text-sm"
              type="number"
              min={salaryMin ?? 0}
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <div className="mb-1 font-medium">Skills</div>
        <SkillList
          primary
          allSkills={selectedSkills.map(s => s.skill)}
          skills={selectedSkills}
          toggleSkill={toggleSkill}
          addSkill={async (name) => {
            addSkillMutation.mutate({ type: "language", name });
          }}
        />
      </div>

      <div>
        <div onClick={handleClickSave}>Save</div>
      </div>
    </div>
  );
};
const Main = ({ user }: { user?: SessionUser }) => {
  const [type, setType] = React.useState<"link" | "post">("link");
  const [newModalOpen, setNewModalOpen] = React.useState(false);
  const jobsQuery = api.post.searchJobs.useQuery({ search: "" });
  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="font-medium opacity-80">Jobs</div>
        </div>
        {user && (
          <button
            onClick={() => setNewModalOpen(true)}
            className="rounded bg-white px-4 py-1 text-black">
            Add Job
          </button>
        )}
      </div>
      <div>
        {jobsQuery.data?.map((job) => (
          <div key={job.id} className="mb-4 rounded bg-white/5 p-4 flex items-center justify-between">
            <div>
            <div className="font-medium mb-1">{job.companyName}</div>
            <div className="text-sm flex items-center mb-3">{job.jobTitle}{job.allowRemote && <div className='bg-blue-500 ml-2 text-xs text-white px-1.5 py-0.5 opacity-80 rounded-full'>Allows Remote</div>}</div>
            <div className="text-sm">{job.location}</div>
            <div className="text-sm opacity-80">
              {job.salaryMin?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })} - {" "}
              {job.salaryMax?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <div className="text-sm">{job.aboutCompany}</div>
            <div className="text-sm">{job.aboutTeam}</div>
            <div className="flex items-center space-x-2">
              {job.skills
                .filter((s) => s.image)
                .map((s) => (
                  <div key={s.id}>
                    <Image
                      src={s.image ?? ""}
                      alt={s.name ?? ""}
                      width={16}
                      height={16}
                    />
                  </div>
                ))}
            </div>
          </div>
            <div>
              {job.url &&
              <Link href={job.url} target='_blank'>Link</Link>
              }
            </div>
          </div>
        ))}
      </div>
      <Dialog.Root open={newModalOpen} onOpenChange={setNewModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-[6px] bg-[#202835] text-white focus:outline-none">
            <div className="flex bg-[#353c48] px-6 py-2">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] text-sm font-medium uppercase">
                Add Job
              </Dialog.Title>
            </div>
            <div className="p-6">
              <div className="mb-6 flex space-x-4">
                <div
                  onClick={() => setType("post")}
                  className={classNames(
                    "flex flex-1 cursor-pointer items-center justify-center rounded border py-2",
                    type === "post"
                      ? "border-blue-400 bg-blue-50 text-blue-500"
                      : "",
                  )}
                >
                  <LinkIcon
                    className={classNames(
                      "mr-1 h-4 w-4 fill-gray-500",
                      type === "post" ? "fill-blue-500" : "",
                    )}
                  />{" "}
                  Create Job Post
                </div>
                <div
                  onClick={() => setType("link")}
                  className={classNames(
                    "flex flex-1 cursor-pointer items-center justify-center rounded border py-2",
                    type === "link"
                      ? "border-blue-400 bg-blue-50 text-blue-500"
                      : "",
                  )}
                >
                  <LinkIcon
                    className={classNames(
                      "mr-1 h-4 w-4 fill-gray-500",
                      type === "link" ? "fill-blue-500" : "",
                    )}
                  />{" "}
                  Link to URL
                </div>
              </div>
              {type === "link" && (
                <LinkForm
                  close={() => setNewModalOpen(false)}
                  refetch={() => {
                    void jobsQuery.refetch();
                  }}
                />
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default Main;
