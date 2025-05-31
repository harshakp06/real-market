import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

const sampleProperties = [
  {
    title: "Modern Luxury Villa",
    location: "Beverly Hills, CA",
    price: 5200000,
    imageurl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop",
    description: "Stunning modern villa with panoramic views, infinity pool, and smart home features."
  },
  {
    title: "Cozy Downtown Loft",
    location: "Manhattan, NY",
    price: 1200000,
    imageurl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop",
    description: "Industrial-style loft with high ceilings, exposed brick, and modern amenities."
  },
  {
    title: "Beachfront Paradise",
    location: "Miami Beach, FL",
    price: 3500000,
    imageurl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
    description: "Direct oceanfront property with private beach access and stunning views."
  },
  {
    title: "Mountain Retreat",
    location: "Aspen, CO",
    price: 4800000,
    imageurl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop",
    description: "Luxury ski-in/ski-out chalet with breathtaking mountain views."
  },
  {
    title: "Urban Penthouse",
    location: "Chicago, IL",
    price: 2900000,
    imageurl: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&auto=format&fit=crop",
    description: "Spectacular penthouse with wraparound terrace and city views."
  },
  {
    title: "Historic Brownstone",
    location: "Boston, MA",
    price: 3200000,
    imageurl: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&auto=format&fit=crop",
    description: "Beautifully restored 19th-century brownstone with modern updates."
  }
];

async function seedProperties() {
  try {
    console.log('Starting to seed properties...');

    for (const property of sampleProperties) {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
        'properties',
        ID.unique(),
        property
      );
      console.log(`Created property: ${property.title}`);
    }

    console.log('Successfully seeded all properties!');
  } catch (error) {
    console.error('Error seeding properties:', error);
  }
}

// Run the seeding function
seedProperties(); 