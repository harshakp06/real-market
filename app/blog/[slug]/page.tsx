import { Client, Databases, Query } from 'node-appwrite';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

async function getBlogPost(slug: string) {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      'blog_posts',
      [Query.equal('slug', slug)]
    );

    if (response.documents.length === 0) {
      return null;
    }

    return response.documents[0];
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const description = post.content.substring(0, 160) + '...';

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.$createdAt,
      authors: [post.author],
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.content.substring(0, 160) + '...',
    image: post.imageUrl,
    url: `https://blog.real.harshafix.diy/${post.slug}`,
    datePublished: post.$createdAt,
    dateModified: post.$updatedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Real Market',
      logo: {
        '@type': 'ImageObject',
        url: 'https://real.harshafix.diy/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://blog.real.harshafix.diy/${post.slug}`,
    },
  };

  return (
    <>
      <Script id="blog-post-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative w-full h-[400px] mb-8">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover rounded-lg shadow-lg"
            priority
          />
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center text-gray-600">
            <time dateTime={post.$createdAt}>
              {new Date(post.$createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </div>
        </header>

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: post.content.split('\n').map((paragraph: string) => `<p>${paragraph}</p>`).join('')
          }}
        />

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">About the Author</h2>
              <p className="mt-2 text-gray-600">{post.author}</p>
            </div>
            <div className="flex space-x-4">
              <a
                href={`https://twitter.com/share?url=${encodeURIComponent(
                  `https://blog.real.harshafix.diy/${post.slug}`
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                Share on Twitter
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  `https://blog.real.harshafix.diy/${post.slug}`
                )}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                Share on LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
} 