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
  fetchUser: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          username: input
        },
        include: {
          projects: true
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
        twitterUsername: user?.twitterUsername,
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

  fetchProjects: protectedProcedure
    .query(async ({ ctx }) => {
      const projects = await ctx.db.project.findMany({
        where: { createdBy: { id: ctx.session.user.id } },
      });

      return projects;
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
});
