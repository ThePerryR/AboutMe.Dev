import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

import { db } from "~/server/db";

const f = createUploadthing({
    errorFormatter: (err) => {
        return {
            message: err.message,
            zodError: err.cause instanceof z.ZodError ? err.cause.flatten() : null,
        };
    }
});

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {

    imageUploader: f({ image: { maxFileSize: "1MB" } })
        .middleware(async ({ req }) => {
            const session = await getServerAuthSession()
            if (!session?.user) throw new UploadThingError("Unauthorized");
            return { userId: session.user.id }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db.user.update({
                where: { id: metadata.userId },
                data: {
                    image: file.url
                }
            })
            return { url: file.url };
        }),
      logoUploader: f({ image: { maxFileSize: "1MB" } })
        .middleware(async ({ req }) => {
            const session = await getServerAuthSession()
            if (!session?.user) throw new UploadThingError("Unauthorized");
            return { userId: session.user.id }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { url: file.url };
        }),
    projectImage: f({ image: { maxFileSize: "4MB" } })
        .input(z.object({ projectId: z.number() }))
        .middleware(async ({ req, input }) => {
            const session = await getServerAuthSession()
            if (!session?.user) throw new UploadThingError("Unauthorized");
            return { userId: session.user.id, projectId: input.projectId }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            await db.project.update({
                where: { id: metadata.projectId },
                data: { image: file.url }
            })
            return { url: file.url };
        }),
    companyLogo: f({ image: { maxFileSize: "1MB" } })
        .input(z.object({ experienceId: z.number() }))
        .middleware(async ({ req, input }) => {
            const session = await getServerAuthSession()
            if (!session?.user) throw new UploadThingError("Unauthorized");
            return { userId: session.user.id, experienceId: input.experienceId }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db.experience.update({
                where: { id: metadata.experienceId },
                data: { companyLogo: file.url }
            })
            return { url: file.url };
        }),
    skillIcon: f({ image: { maxFileSize: "1MB" } })
        .input(z.object({ skillId: z.number() }))
        .middleware(async ({ req, input }) => {
            const session = await getServerAuthSession()
            if (!session?.user) throw new UploadThingError("Unauthorized");
            return { userId: session.user.id, skillId: input.skillId }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db.skill.update({
                where: { id: metadata.skillId },
                data: { image: file.url }
            })
            return { url: file.url };
        })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
