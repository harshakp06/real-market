// import { Client, Databases, Query } from 'node-appwrite';
// import { NextResponse } from 'next/server';

// const client = new Client()
//   .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
//   .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
//   .setKey(process.env.APPWRITE_API_KEY || '');

// const databases = new Databases(client);

// export async function GET() {
//   try {
//     const response = await databases.listDocuments(
//       process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
//       'properties',
//       [
//         Query.limit(6),
//         Query.orderDesc('$createdAt')
//       ]
//     );
    
//     return NextResponse.json(response.documents);
//   } catch (error) {
//     console.error('Error fetching properties:', error);
//     return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
//   }
// } 


import { NextResponse } from 'next/server';
import { Client, Databases } from 'node-appwrite';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
    const databases = new Databases(client);
    const property = await databases.getDocument(
      'DATABASE_ID', // Replace with actual DATABASE_ID from Appwrite
      'properties',
      context.params.id
    );
    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}