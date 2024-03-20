import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      isSuperUser: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    isSuperUser: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => {
      return ({
        ...session,
        user: {
          ...session.user,
          id: user.id,
          username: user.username,
          isSuperUser: user.isSuperUser
        },
      })
    },
  },
  events: {
    linkAccount: async (message) => {
      const accessToken = message.account.access_token
      if (accessToken) {
        // fetch user's username from github api
        const response = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`
          }
        })
        const data = await response.json() as { login: string, blog: string | null, hireable: boolean | null, bio: string | null, company: string | null, twitter_username: string | null, created_at: string }
        // update user's profile
        await db.user.update({
          where: {
            id: message.user.id
          },
          data: {
            username: data.login.toLowerCase(),
            hireable: data.hireable ?? false,
            headline: data.bio,
            twitterUsername: data.twitter_username,
            githubCreatedAt: new Date(data.created_at)
          }
        })
      }
    }
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
