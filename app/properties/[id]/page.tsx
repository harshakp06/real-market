import { Client, Databases } from 'appwrite';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="relative h-[500px]">
            <Image
              src={property.imageUrl}
              alt={property.title}
              fill
              className="object-cover rounded-lg shadow-lg"
              priority
            />
          </div>

          {/* Property Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {property.title}
            </h1>
            <p className="text-2xl text-blue-600 font-bold mb-6">
              ${property.price.toLocaleString()}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-100 p-4 rounded-lg">
                <span className="block text-gray-600">Bedrooms</span>
                <span className="text-xl font-semibold">{property.bedrooms}</span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <span className="block text-gray-600">Bathrooms</span>
                <span className="text-xl font-semibold">{property.bathrooms}</span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <span className="block text-gray-600">Area</span>
                <span className="text-xl font-semibold">{property.area} sqft</span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <span className="block text-gray-600">Type</span>
                <span className="text-xl font-semibold capitalize">
                  {property.type}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>
              <p className="text-gray-600">{property.location}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <div 
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>

            {/* Contact Form */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Contact Agent</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full border rounded-md p-2"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full border rounded-md p-2"
                    placeholder="Your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="w-full border rounded-md p-2"
                    rows={4}
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-150 ease-in-out"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 