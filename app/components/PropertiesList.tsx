'use client';

import { Models } from 'node-appwrite';
import PropertyCard from './PropertyCard';

interface Property extends Models.Document {
  title: string;
  location: string;
  price: number;
  imageurl: string;
  description: string;
}

interface PropertiesListProps {
  properties: Property[];
}

export default function PropertiesList({ properties }: PropertiesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard key={property.$id} property={property} />
      ))}
    </div>
  );
} 