import { Client, Databases, Storage } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const storage = new Storage(client);

async function initializeAppwrite() {
  try {
    // Create database
    const database = await databases.create(
      'real_market_db',
      'Real Market Database'
    );
    console.log('Database created:', database.$id);

    // Create properties collection
    const propertiesCollection = await databases.createCollection(
      database.$id,
      'properties',
      'Properties'
    );
    console.log('Properties collection created:', propertiesCollection.$id);

    // Create properties attributes
    await databases.createStringAttribute(
      database.$id,
      propertiesCollection.$id,
      'title',
      255,
      true
    );
    await databases.createStringAttribute(
      database.$id,
      propertiesCollection.$id,
      'description',
      10000,
      true
    );
    await databases.createStringAttribute(
      database.$id,
      propertiesCollection.$id,
      'location',
      255,
      true
    );
    await databases.createFloatAttribute(
      database.$id,
      propertiesCollection.$id,
      'price',
      true
    );
    await databases.createStringAttribute(
      database.$id,
      propertiesCollection.$id,
      'imageUrl',
      1000,
      true
    );
    await databases.createStringAttribute(
      database.$id,
      propertiesCollection.$id,
      'type',
      50,
      true
    );
    await databases.createIntegerAttribute(
      database.$id,
      propertiesCollection.$id,
      'bedrooms',
      true
    );
    await databases.createIntegerAttribute(
      database.$id,
      propertiesCollection.$id,
      'bathrooms',
      true
    );
    await databases.createFloatAttribute(
      database.$id,
      propertiesCollection.$id,
      'area',
      true
    );

    // Create blog posts collection
    const blogCollection = await databases.createCollection(
      database.$id,
      'blog_posts',
      'Blog Posts'
    );
    console.log('Blog posts collection created:', blogCollection.$id);

    // Create blog posts attributes
    await databases.createStringAttribute(
      database.$id,
      blogCollection.$id,
      'title',
      255,
      true
    );
    await databases.createStringAttribute(
      database.$id,
      blogCollection.$id,
      'content',
      50000,
      true
    );
    await databases.createStringAttribute(
      database.$id,
      blogCollection.$id,
      'slug',
      255,
      true
    );
    await databases.createStringAttribute(
      database.$id,
      blogCollection.$id,
      'imageUrl',
      1000,
      true
    );
    await databases.createStringAttribute(
      database.$id,
      blogCollection.$id,
      'author',
      255,
      true
    );

    // Create pages collection
    const pagesCollection = await databases.createCollection(
      database.$id,
      'pages',
      'Pages'
    );
    console.log('Pages collection created:', pagesCollection.$id);

    // Create pages attributes
    await databases.createStringAttribute(
      database.$id,
      pagesCollection.$id,
      'title',
      255,
      true
    );
    await databases.createStringAttribute(
      database.$id,
      pagesCollection.$id,
      'content',
      50000,
      true
    );
    await databases.createStringAttribute(
      database.$id,
      pagesCollection.$id,
      'slug',
      255,
      true
    );

    // Create storage bucket for media
    const bucket = await storage.createBucket(
      'media',
      'Media Storage',
      ['image/jpeg', 'image/png', 'image/webp']
    );
    console.log('Storage bucket created:', bucket.$id);

    console.log('Appwrite initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing Appwrite:', error);
  }
}

initializeAppwrite(); 