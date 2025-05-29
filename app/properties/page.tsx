'use client';

import { useState, useEffect } from 'react';
import { Client, Databases, Query } from 'appwrite';
import Link from 'next/link';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

interface Property {
  $id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      const queries: string[] = [];

      if (filters.type) {
        queries.push(Query.equal('type', filters.type));
      }
      if (filters.minPrice) {
        queries.push(Query.greaterThanEqual('price', parseFloat(filters.minPrice)));
      }
      if (filters.maxPrice) {
        queries.push(Query.lessThanEqual('price', parseFloat(filters.maxPrice)));
      }
      if (filters.bedrooms) {
        queries.push(Query.equal('bedrooms', parseInt(filters.bedrooms)));
      }

      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        'properties',
        queries
      );

      setProperties(response.documents as Property[]);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectInput>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Properties</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border rounded-md p-2"
        >
          <option value="">Property Type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="condo">Condo</option>
        </select>

        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="Min Price"
          className="border rounded-md p-2"
        />

        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="Max Price"
          className="border rounded-md p-2"
        />

        <select
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleFilterChange}
          className="border rounded-md p-2"
        >
          <option value="">Bedrooms</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div
            key={property.$id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={property.imageUrl}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-4">{property.location}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  ${property.price.toLocaleString()}
                </span>
                <div className="flex space-x-4 text-gray-600">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>{property.area} sqft</span>
                </div>
              </div>
              <Link
                href={`/properties/${property.$id}`}
                className="block w-full bg-gray-800 hover:bg-gray-900 text-white text-center px-4 py-2 rounded-md"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No properties found matching your criteria.</p>
        </div>
      )}
    </div>
  );
} 