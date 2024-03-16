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
            // const user = auth(req); 
            const session = await getServerAuthSession()
            console.log('aoaoaoaoaoaoaoa')
            console.log(session)
            console.log('aoaoaoaoaoaoaoa')
            if (!session?.user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata);

            console.log("file url", file.url);
            await db.user.update({
                where: { id: metadata.userId },
                data: {
                    image: file.url
                }
            })

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { url: file.url };
        }),
    projectImage: f({ image: { maxFileSize: "4MB" } })
        .input(z.object({ projectId: z.number() }))
        .middleware(async ({ req, input }) => {
            // const user = auth(req); 
            const session = await getServerAuthSession()
            if (!session?.user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.user.id, projectId: input.projectId }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata);

            console.log("file url", file.url);
            await db.project.update({
                where: { id: metadata.projectId },
                data: {
                    image: file.url
                }
            })

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { url: file.url };
        })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
