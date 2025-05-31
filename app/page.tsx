import Link from 'next/link';
import { Client, Databases, Query, Models } from 'node-appwrite';
import PropertiesList from './components/PropertiesList';

interface Property extends Models.Document {
  title: string;
  location: string;
  price: number;
  imageurl: string;
  description: string;
}

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
      'properties',
      [
        Query.limit(6),
        Query.orderDesc('$createdAt')
      ]
    );
    return response.documents as Property[];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export default async function Home() {
  const properties = await getFeaturedProperties();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Dream Property
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Discover the perfect home with our extensive property listings
          </p>
          <Link
            href="/properties"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium inline-block"
          >
            Browse Properties
          </Link>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Properties
          </h2>
          <PropertiesList properties={properties} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl mb-8">
            Browse our extensive collection of properties and find your dream home today.
          </p>
          <Link
            href="/properties"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium inline-block"
          >
            Start Browsing
          </Link>
        </div>
      </section>
    </div>
  );
}
