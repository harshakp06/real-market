import { Client, Databases } from 'node-appwrite';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

async function getProperty(id: string) {
  try {
    const property = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      'properties',
      id
    );
    return property;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.id);

  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'The requested property could not be found.',
    };
  }

  return {
    title: property.title,
    description: `${property.title} - ${property.bedrooms} bed, ${property.bathrooms} bath, ${property.area} sqft ${property.type} in ${property.location}. Price: $${property.price.toLocaleString()}`,
    openGraph: {
      title: property.title,
      description: `${property.title} - ${property.bedrooms} bed, ${property.bathrooms} bath property in ${property.location}`,
      images: [
        {
          url: property.imageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: `${property.title} - ${property.bedrooms} bed, ${property.bathrooms} bath property in ${property.location}`,
      images: [property.imageUrl],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const property = await getProperty(params.id);

  if (!property) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    image: property.imageUrl,
    url: `https://real.harshafix.diy/properties/${property.$id}`,
    datePosted: property.$createdAt,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
    },
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    numberOfRooms: property.bedrooms,
    numberOfBathrooms: property.bathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: 'FTK',
    },
  };

  return (
    <>
      <Script id="property-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full h-96">
              <Image
                src={property.imageUrl}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">{property.location}</p>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  ${property.price.toLocaleString()}
                </p>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {property.description}
                </p>
              </div>
              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  ← Back to Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 