import { Client, Databases } from 'node-appwrite';
import { NextResponse } from 'next/server';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  
  try {
    const property = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
      'properties',
      id
    );
    
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
} 