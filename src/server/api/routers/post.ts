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
          username: input
        },
        include: {
          projects: true,
          experiences: true
        }
      });
      console.log(1929919191)
      console.log(user)
      console.log(1929919191)
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
            isFavorited: project.isFavorited
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
      console.log(1)
      const project = projects.find((p) => p.id === input)
      if (!project) {
        throw new Error('Project not found')
      }
      console.log(2)
      if (!project.isFavorited && projects.filter((p) => p.isFavorited).length >= 6) {
        throw new Error('You can only favorite up to 6 projects')
      }
      console.log(3)
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
  toggleSkill: protectedProcedure
    .input(z.object({ id: z.number(), primary: z.boolean().optional() }))
    .mutation(async ({ ctx, input }) => {
      console.log('toggle')
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
        console.log(2)
        await ctx.db.userSkill.create({
          data: {
            userId: ctx.session.user.id,
            skillId: input.id,
            primary: input.primary
          }
        })
      }
    }),
  addSkill: protectedProcedure
    .input(z.object({
      name: z.string(),
      type: z.string(),
      primary: z.boolean().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const skill = await ctx.db.skill.create({
        data: {
          name: input.name,
          type: input.type
        }
      })

      const userSkill = await ctx.db.userSkill.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          skill: { connect: { id: skill.id } },
          primary: input.primary
        }
      })

      return userSkill
    }),
});
