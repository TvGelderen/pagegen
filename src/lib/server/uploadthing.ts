import { createUploadthing, UTApi } from "uploadthing/server";
import type { FileRouter } from "uploadthing/server";
import { lucia } from "./auth";
import { insertLogo } from "./db";
import { UPLOADTHING_SECRET } from "$env/static/private";

const f = createUploadthing();

async function auth(req: Request) {
    const sessionId = req.headers.get("cookie")?.split(`${lucia.sessionCookieName}=`)[1].split(';')[0];
    if (!sessionId) return null;

    const { user } = await lucia.validateSession(sessionId);

    return user?.id;
}

export const fileRouter = {
    logoUploader: f({ image: { maxFileSize: "2MB" } })
        .middleware(async ({ req }) => {
            const userId = await auth(req);
            if (!userId) {
                throw new Error("Unauthorized");
            }

            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);

            console.log(file)

            insertLogo(metadata.userId, file.key, file.url);
        })
} satisfies FileRouter;

export type PagegenFileRouter = typeof fileRouter;

export const utapi = new UTApi({
    apiKey: UPLOADTHING_SECRET
});
