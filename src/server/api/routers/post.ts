import { sqltag } from "@prisma/client/runtime/library";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getPublicUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx }) => {
      // return ctx.db.user.findUnique({
      //   where: { id: ctx.input.id },
      // });
    }),
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
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
      if (!user) {
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
            headline: project.headline,
            isFavorited: project.isFavorited,
            skills: project.skills.map(skill => {
              return ({
                id: skill.id,
                name: skill.name,
                type: skill.type,
                image: skill.image
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
            image: skill.skill.image
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

  fetchProjects: protectedProcedure
    .query(async ({ ctx }) => {
      const projects = await ctx.db.project.findMany({
        where: { createdBy: { id: ctx.session.user.id } },
        include: { skills: true }
      });

      return projects;
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
      headline: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          url: input.url,
          status: input.status,
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
      exclude: z.array(z.number()).optional()
    }))
    .query(async ({ ctx, input }) => {

      return ctx.db.skill.findMany({
        where: {
          name: { contains: input.search },
          id: { notIn: input.exclude }
        },
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
        await ctx.db.userSkill.delete({
          where: { id: userSkill.id, userId: ctx.session.user.id }
        })
      } else {
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

      return userSkill.skill
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
    })
});
