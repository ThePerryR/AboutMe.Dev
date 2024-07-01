import { type UpdateType, Visibility } from "@prisma/client";
import { sqltag } from "@prisma/client/runtime/library";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  fetchMyUser: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
    }),
  fetchUser: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          username: input.toLowerCase(),
        },
        include: {
          projects: {
            include: {
              skills: true
            }
          },
          experiences: true,
          skills: {
            include: {
              skill: true
            }
          },
          interests: true
        }
      });
      if (!user || user.profileVisibility === Visibility.PRIVATE) {
        return null;
      }
      return {
        username: user?.username,
        name: user?.name,
        image: user?.image,
        headline: user?.headline,
        region: user?.region,
        location: user?.location,
        website: user?.website,
        nationalityEmoji: user?.nationalityEmoji,
        statusEmoji: user?.statusEmoji,
        twitterUsername: user?.twitterUsername,
        linkedinUsername: user?.linkedinUsername,
        githubCreatedAt: user?.githubCreatedAt,
        projects: user.projects.map(project => {
          return ({
            id: project.id,
            name: project.name,
            url: project.url,
            image: project.image,
            status: project.status,
            description: project.description,
            headline: project.headline,
            isFavorited: project.isFavorited,
            skills: project.skills.map(skill => {
              return ({
                id: skill.id,
                name: skill.name,
                type: skill.type,
                image: skill.image,
              })
            })
          })
        }),
        interests: user.interests.map(interest => {
          return ({
            id: interest.id,
            name: interest.name,
            image: interest.image
          })
        }),
        experiences: user.experiences.map(experience => {
          return ({
            id: experience.id,
            role: experience.role,
            company: experience.company,
            companyLogo: experience.companyLogo,
            startDate: experience.startDate,
            description: experience.description,
            endDate: experience.endDate,
            isCurrent: experience.isCurrent
          })
        }),
        skills: user.skills.map(skill => {
          return ({
            id: skill.id,
            name: skill.skill.name,
            type: skill.skill.type,
            primary: skill.primary,
            image: skill.skill.image,
            order: skill.order
          })
        })
      };
    }),

  updateName: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input },
      });
    }),

  updateLinks: protectedProcedure
    .input(z.object({
      twitterUsername: z.string().optional(),
      linkedinUsername: z.string().optional(),
      website: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          twitterUsername: input.twitterUsername,
          linkedinUsername: input.linkedinUsername,
          website: input.website
        },
      });
    }),

  updateLocation: protectedProcedure
    .input(z.object({ region: z.string().optional(), location: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { region: input.region, location: input.location },
      });
    }),

  updateExperience: protectedProcedure
    .input(z.object({
      id: z.number(),
      description: z.string().optional(),
      role: z.string().optional(),
      company: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      isCurrent: z.boolean().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.experience.update({
        where: { id: input.id },
        data: {
          role: input.role,
          description: input.description,
          company: input.company,
          startDate: input.startDate,
          endDate: input.endDate,
          isCurrent: input.isCurrent
        },
      });
    }),
  deleteExperience: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const experience = await ctx.db.experience.findUnique({
        where: { id: input }
      })
      if (!experience) {
        throw new Error('Experience not found')
      }
      if (experience.createdById !== ctx.session.user.id) {
        throw new Error('You do not have permission to delete this experience')
      }
      await ctx.db.experience.delete({
        where: { id: input }
      })
      return true
    }),

  createProject: protectedProcedure
    .mutation(async ({ ctx }) => {
      const favoritedProjects = await ctx.db.project.findMany({
        where: { createdBy: { id: ctx.session.user.id }, isFavorited: true }
      })
      const isFavorited = favoritedProjects.length < 6
      const project = ctx.db.project.create({
        data: {
          createdBy: { connect: { id: ctx.session.user.id } },
          isFavorited
        },
      });

      return project;
    }),

  createExperience: protectedProcedure
    .mutation(async ({ ctx }) => {
      const experience = ctx.db.experience.create({
        data: {
          createdBy: { connect: { id: ctx.session.user.id } }
        }
      })
      return experience
    }),

  addUpdate: protectedProcedure
    .input(z.object({
      projectId: z.number().optional(),
      title: z.string(),
      content: z.string().optional(),
      type: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId }
      })
      if (!project) {
        throw new Error('Project not found')
      }
      const update = await ctx.db.update.create({
        data: {
          title: input.title,
          content: input.content,
          type: input.type as UpdateType,
          project: { connect: { id: input.projectId } },
          createdBy: { connect: { id: ctx.session.user.id } }
        }
      })
      return update
    }),
  fetchUpdates: protectedProcedure
    .query(async ({ ctx }) => {
      const updates = await ctx.db.update.findMany({
        where: { createdBy: { id: ctx.session.user.id } },
        include: { project: true }
      })
      return updates
    }),

  fetchProjects: protectedProcedure
    .query(async ({ ctx }) => {
      const projects = await ctx.db.project.findMany({
        where: { createdBy: { id: ctx.session.user.id } },
        include: { skills: true, users: { include: { user: true }} }
      });

      return projects;
    }),
  fetchProject: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input },
        include: { skills: true, updates: true, users: { include: { user: true }} }
      });
      return project;
    }),
  fetchExperiences: protectedProcedure
    .query(async ({ ctx }) => {
      const experiences = await ctx.db.experience.findMany({
        where: { createdBy: { id: ctx.session.user.id } }
      })
      return experiences
    }),
  updateProject: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      url: z.string().optional(),
      status: z.string().optional(),
      description: z.string().optional(),
      headline: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          url: input.url,
          status: input.status,
          description: input.description,
          headline: input.headline
        },
      });
    }),
  deleteProject: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input }
      })
      if (!project) {
        throw new Error('Project not found')
      }
      if (project.createdById !== ctx.session.user.id) {
        throw new Error('You do not have permission to delete this project')
      }
      await ctx.db.project.delete({
        where: { id: input }
      })
      return true
    }),
  toggleProjectFavorite: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const projects = await ctx.db.project.findMany({
        where: { createdBy: { id: ctx.session.user.id } }
      })
      const project = projects.find((p) => p.id === input)
      if (!project) {
        throw new Error('Project not found')
      }
      if (!project.isFavorited && projects.filter((p) => p.isFavorited).length >= 6) {
        throw new Error('You can only favorite up to 6 projects')
      }
      const isFavorited = project.isFavorited
      const updatedProject = await ctx.db.project.update({
        where: { id: input },
        data: { isFavorited: !isFavorited }
      })
      return updatedProject
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getSkills: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.userSkill.findMany({
        where: { userId: ctx.session.user.id },
        include: { skill: true }
      });
    }),

  searchSkills: publicProcedure
    .input(z.object({
      search: z.string(),
      exclude: z.array(z.number()).optional(),
      take: z.number().optional()
    }))
    .query(async ({ ctx, input }) => {

      return ctx.db.skill.findMany({
        where: {
          name: { contains: input.search },
          id: { notIn: input.exclude }
        },
        take: input.take ?? 12
      });
    }),

  updateSkill: protectedProcedure
    .input(z.object({
      id: z.number(),
      type: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.skill.update({
        where: { id: input.id },
        data: {
          type: input.type
        }
      })
    }),
  addUserToProject: protectedProcedure
    .input(z.object({ projectId: z.number(), username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { username: input.username }
      })
      if (!user) {
        throw new Error('User not found')
      }
      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId }
      })
      if (!project) {
        throw new Error('Project not found')
      }
      await ctx.db.userProject.create({
        data: {
          user: { connect: { id: user.id } },
          project: { connect: { id: project.id } }
        }
      })
    }),
  removeUserFromProject: protectedProcedure
    .input(z.object({ projectId: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId }
      })
      if (!user) {
        throw new Error('User not found')
      }
      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId }
      })
      if (!project) {
        throw new Error('Project not found')
      }
      await ctx.db.userProject.deleteMany({
        where: {
          userId: user.id,
          projectId: project.id
        }
      })
    }),
  updateSkillOrder: protectedProcedure
    .input(z.array(z.object({ id: z.number(), order: z.number(), primary: z.boolean() })))
    .mutation(async ({ ctx, input }) => {
      const userSkills = await ctx.db.userSkill.findMany({ where: { userId: ctx.session.user.id } })
      for (const skill of input) {
        const userSkill = userSkills.find((us) => us.id === skill.id)
        if (userSkill && (userSkill.order !== skill.order || userSkill.primary !== skill.primary)) {
          await ctx.db.userSkill.update({
            where: { id: skill.id },
            data: { order: skill.order, primary: skill.primary }
          })
        }
      }
    }),
  toggleSkill: protectedProcedure
    .input(z.object({ id: z.number(), primary: z.boolean().optional(), projectId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (input.projectId) {
        const project = await ctx.db.project.findUnique({ where: { id: input.projectId }, include: { skills: true } })
        if (!project) { throw new Error('Project not found') }
        if (project.skills.find((s) => s.id === input.id)) {
          const project = await ctx.db.project.update({
            where: { id: input.projectId },
            data: {
              skills: {
                disconnect: { id: input.id }
              }
            },
            include: { skills: true }
          })
          return project.skills
        } else {
          const project = await ctx.db.project.update({
            where: { id: input.projectId },
            data: {
              skills: {
                connect: { id: input.id }
              }
            },
            include: { skills: true }
          })
          return project.skills
        }
      }

      // add the userskill if doesn't exist, otherwise delete it
      const userSkill = await ctx.db.userSkill.findFirst({
        where: {
          userId: ctx.session.user.id,
          skillId: input.id
        }
      })
      if (userSkill) {
        console.log('delete')
        await ctx.db.userSkill.delete({
          where: { id: userSkill.id, userId: ctx.session.user.id }
        })
      } else {
        console.log('create')
        await ctx.db.userSkill.create({
          data: {
            userId: ctx.session.user.id,
            skillId: input.id,
            primary: input.primary
          }
        })
      }
      const userSkills = await ctx.db.userSkill.findMany({
        where: { userId: ctx.session.user.id },
        include: { skill: true }
      })
      return userSkills.map((us) => us.skill)
    }),
  parseWebsite: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      console.log(input)
    }),
  addSkill: protectedProcedure
    .input(z.object({
      name: z.string(),
      type: z.string(),
      projectId: z.number().optional(),
      primary: z.boolean().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const skill = await ctx.db.skill.create({
        data: {
          name: input.name,
          type: input.type
        }
      })

      if (input.projectId) {

        await ctx.db.project.update({
          where: { id: input.projectId },
          data: {
            skills: {
              connect: { id: skill.id }
            }
          }
        })
        return skill
      }

      const userSkill = await ctx.db.userSkill.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          skill: { connect: { id: skill.id } },
          primary: input.primary
        },
        include: {
          skill: true
        }
      })

      return userSkill
    }),
  getInterests: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          interests: true
        }
      });
      return user?.interests ?? []
    }),
  toggleInterest: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id }, include: { interests: true } })
      if (user?.interests.find((i) => i.id === input)) {
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            interests: {
              disconnect: { id: input }
            }
          }
        })
      } else {
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            interests: {
              connect: { id: input }
            }
          }
        })
      }
    }),
  addInterest: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const interest = await ctx.db.interest.create({
        data: {
          name: input
        }
      })
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          interests: {
            connect: { id: interest.id }
          }
        }
      })
    }),

  fetchAllUsers: publicProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.db.user.findMany()
      return users.map(user => {
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          flair: user.statusEmoji,
        }
      })
    }),

  fetchUsers: protectedProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.db.user.findMany({
        where: { id: { not: ctx.session.user.id } }
      })

      return users.map(user => {
        return {
          id: user.id,
          username: user.username,
          name: user.name,
          flair: user.statusEmoji,
        }
      })
    }),

    fetchDashboard: publicProcedure
    .query(async ({ ctx }) => {
      console.log('dashboard')
    }),

  searchInterests: publicProcedure
    .input(z.object({
      search: z.string(),
      exclude: z.array(z.number()).optional(),
      limit: z.number().optional()
    }))
    .query(async ({ ctx, input }) => {
      const interestIds = await ctx.db.$queryRaw<{ interestId: number }[]>(sqltag`SELECT A as interestId, COUNT(B) as count
                                              FROM _InterestToUser
                                              GROUP BY A
                                              ORDER BY COUNT(B) DESC`);

      // Filter out the excluded IDs and limit the number of IDs to include
      const filteredInterestIds = interestIds
        .map((row) => row.interestId)
        .filter((id) => !input.exclude?.includes(id))

      // Then, fetch the interest details for these IDs in the order of usage frequency
      if (filteredInterestIds.length === 0) {
        return [];
      }

      return ctx.db.interest.findMany({
        where: {
          id: { in: filteredInterestIds },
          name: { contains: input.search }
        },
        orderBy: {
          // name: 'asc' // Or any other ordering you prefer
        },
        take: input.limit
      });
    }),
  updateInterest: protectedProcedure
    .input(z.object({
      id: z.number(),
      image: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.interest.update({
        where: { id: input.id },
        data: {
          image: input.image
        }
      })
    }),
  updateStatuses: protectedProcedure
    .input(z.object({
      nationalityEmoji: z.string().optional().nullable(),
      statusEmoji: z.string().optional().nullable()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          nationalityEmoji: input.nationalityEmoji,
          statusEmoji: input.statusEmoji
        }
      })
    }),

  clearProfilePicture: protectedProcedure
    .mutation(async ({ ctx }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          image: null
        }
      })
    }),
    getTeams: protectedProcedure
    .query(async ({ ctx }) => {
      const teams = await ctx.db.team.findMany({
        where: { users: { some: { userId: ctx.session.user.id } } },
        include: { 
          users: {
            include: {
              user: {
                select: {
                  image: true,
                  name: true
                }
              }
            }
          } 
        }
      })
      return teams
    }),
    createTeam: protectedProcedure
    .mutation(async ({ ctx }) => {
      
      const team = await ctx.db.team.create({
        data: {}
      })
      await ctx.db.userTeam.create({
        data: {
          owner: true,
          user: { connect: { id: ctx.session.user.id } },
          team: { connect: { id: team.id } }
        }
      })
      return team
    }),
    updateTeam: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      image: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: { id: input.id }
      })
      console.log('AOAOAOAO', team)
      if (!team) {
        throw new Error('Team not found')
      }
      console.log('saving', input.name)
      await ctx.db.team.update({
        where: { id: input.id },
        data: {
          name: input.name,
          image: input.image
        }
      })
      return team
    }),
    getTeam: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: { id: input },
        select: {
          name: true,
          image: true,
          id: true,
          users: {
            select: {
              owner: true,
              user: {
                select: {
                  id: true,
                  image: true,
                  name: true
                }
              }
            }
          }
        }
      })
      console.log('GOT TEAM', team)
      return team
    }),
    deleteTeam: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.findUnique({
        where: { id: input }
      })
      if (!team) {
        throw new Error('Team not found')
      }
      await ctx.db.userTeam.deleteMany({
        where: { teamId: input }
      })
      await ctx.db.team.delete({
        where: { id: input }
      })
    }),
    addUserToTeam: protectedProcedure
    .input(z.object({ teamId: z.number(), username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { username: input.username }
      })
      if (!user) {
        throw new Error('User not found')
      }
      const team = await ctx.db.team.findUnique({
        where: { id: input.teamId }
      })
      if (!team) {
        throw new Error('Team not found')
      }
      await ctx.db.userTeam.create({
        data: {
          user: { connect: { id: user.id } },
          team: { connect: { id: team.id } }
        }
      })
    }),
  updateVisibility: protectedProcedure
    .input(z.object({ profileVisibility: z.enum([Visibility.PUBLIC, Visibility.PRIVATE, Visibility.LINK]) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { profileVisibility: input.profileVisibility },
      });
    }),
  searchJobs: publicProcedure
    .input(z.object({
      search: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const jobs = await ctx.db.job.findMany({
        where: {
          OR: [
            { companyName: { contains: input.search } },
            { jobTitle: { contains: input.search } }
          ]
        },
        include: { skills: true },
        take: 50
      })
      return jobs
    }),
  createJob: protectedProcedure
    .input(z.object({
      url: z.string().url(),
      companyName: z.string().min(1),
      companyLogo: z.string().url().optional(),
      jobTitle: z.string().min(1),
      region: z.string().optional(),
      location: z.string().optional(),
      allowRemote: z.boolean().optional(),
      salaryMin: z.number().optional(),
      salaryMax: z.number().optional(),
      aboutCompany: z.string().optional(),
      aboutTeam: z.string().optional(),
      skills: z.array(z.number())
    }))
    .mutation(async ({ ctx, input }) => {
      const job = await ctx.db.job.create({
        data: {
          url: input.url,
          companyName: input.companyName,
          companyLogo: input.companyLogo,
          jobTitle: input.jobTitle,
          region: input.region,
          location: input.location,
          allowRemote: input.allowRemote,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          aboutCompany: input.aboutCompany,
          aboutTeam: input.aboutTeam,
          createdBy: { connect: { id: ctx.session.user.id } },
          skills: {
            connect: input.skills.map((id) => ({ id }))
          }
        }
      })
      return job
    })
});
