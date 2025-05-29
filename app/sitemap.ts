import { Client, Databases } from 'appwrite';
import { MetadataRoute } from 'next';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all properties
  const properties = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    'properties'
  );

  // Fetch all blog posts
  const blogPosts = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    'blog_posts'
  );

  // Static routes
  const routes = [
    {
      url: 'https://real.harshafix.diy',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://real.harshafix.diy/properties',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://blog.real.harshafix.diy',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://real.harshafix.diy/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ] as const;

  // Property routes
  const propertyRoutes = properties.documents.map((property) => ({
    url: `https://real.harshafix.diy/properties/${property.$id}`,
    lastModified: new Date(property.$updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) as const;

  // Blog post routes
  const blogRoutes = blogPosts.documents.map((post) => ({
    url: `https://blog.real.harshafix.diy/${post.slug}`,
    lastModified: new Date(post.$updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  })) as const;

  return [...routes, ...propertyRoutes, ...blogRoutes];
} 