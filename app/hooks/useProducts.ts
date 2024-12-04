'use client';

import { useState } from 'react';

export interface Product {
  merchantId: string;
  variantId: string;
  productName: string;
  supplierModelNumber: string;
  ean: string[];
  size: string;
  price: number | null;
  product_description: string;
  vendor: string;
  quantity: number;
  productType: string[];
  productGroup: string[];
  department: string[];
  image_url: string;
  created: string | null;
  updated: string | null;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { products, setProducts, loading, setLoading, error, setError };
}; 