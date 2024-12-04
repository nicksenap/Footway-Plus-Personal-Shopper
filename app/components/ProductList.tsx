'use client';

import React from 'react';
import { Product } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  blogPost: string;
}

export const ProductList: React.FC<ProductListProps> = ({ products, blogPost }) => {
  if (!products || products.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard 
          key={`${product.merchantId}-${index}`}
          product={product}
        />
      ))}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="prose max-w-none">
          <p>{blogPost}</p>
        </div>
      </div>
    </div>
  );
}; 