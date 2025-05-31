'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Models } from 'node-appwrite';
import { useState } from 'react';

interface Property extends Models.Document {
  title: string;
  location: string;
  price: number;
  imageurl: string;
  description: string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-48">
        <Image
          src={imageError ? '/placeholder-property.jpg' : property.imageurl}
          alt={property.title}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          priority
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
        <p className="text-gray-600 mb-4">{property.location}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </span>
          <Link
            href={`/properties/${property.$id}`}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
} 