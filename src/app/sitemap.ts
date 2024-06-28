import { Visibility } from '@prisma/client'
import { type MetadataRoute } from 'next'
import { db } from '~/server/db'
import { api } from '~/trpc/server'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const users = await db.user.findMany({ where: { profileVisibility: Visibility.PUBLIC }})
  const projects = await db.project.findMany()
  console.log('usosoer', users)
  return [
    {
      url: 'https://aboutme.dev',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    ...users.map((user) => ({
      url: `https://aboutme.dev/${user.username}`,
      lastModified: new Date(), // todo - get from user.updatedAt
      changeFrequency: 'yearly' as "yearly",
      priority: 1,
    })),
    ...projects.map((project) => ({
      url: `https://aboutme.dev/projects/${project.id}`,
      lastModified: project.updatedAt,
      changeFrequency: 'yearly' as "yearly",
      priority: 0.5,
    })),
  ]
}