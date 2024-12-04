import React from 'react';
import Image from 'next/image';
import { Product } from '../hooks/useProducts';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-xl h-[32rem]">
      {product.image_url && (
        <figure className="flex items-center justify-center">
          <Image
            src={product.image_url}
            alt={product.productName}
            width={400}
            height={192}
            className="w-full h-48 object-contain"
          />
        </figure>
      )}
      <div className="card-body relative">
        <h2 className="card-title">{product.productName}</h2>
        <div className="relative h-40 overflow-hidden">
          {product.product_description && product.product_description.includes('<') ? (
            <div 
              className="absolute inset-0"
              dangerouslySetInnerHTML={{ __html: product.product_description }} 
            />
          ) : (
            <p className="absolute inset-0">{product.product_description || 'No description available'}</p>
          )}
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-base-100 to-transparent" />
        </div>
        <div className="card-actions justify-end mt-auto">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
}; 