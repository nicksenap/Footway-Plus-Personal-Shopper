"use client";

import React from 'react';
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { ProductList } from './components/ProductList';
import { useProducts, Product } from './hooks/useProducts';

export const ProductApp: React.FC = () => {
  const { products, setProducts, loading, setLoading, error, setError } = useProducts();
  const [catalogTitle, setCatalogTitle] = React.useState("Product Catalog");
  const [blogPost, setBlogPost] = React.useState("Welcome to our product catalog!");

  useCopilotReadable({
    description: "The current product catalog",
    value: products,
  });

  useCopilotReadable({
    description: "The current catalog title",
    value: catalogTitle,
  });

  useCopilotReadable({
    description: "The current blog post",
    value: blogPost,
  });

  useCopilotAction({
    name: "displayProducts",
    description: `Displays the product on the page with the available filters`,
    parameters: [
      {
        name: "products",
        type: "string",
        description: "JSON string of products to set in the catalog",
        required: true,
      },
    ],
    handler: async ({ products: newProducts }) => {
      setLoading(true);
      try {
        const cleanedJson = newProducts.trim().replace(/^\uFEFF/, '');
        setProducts(JSON.parse(cleanedJson) as Product[]);
        setError(null);
      } catch (err) {
        console.error('JSON Parse Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to set products');
      } finally {
        setLoading(false);
      }
    }
  });

  useCopilotAction({
    name: "updateCatalogTitle",
    description: "Updates the title of the product catalog",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "New title for the product catalog",
        required: true,
      },
    ],
    handler: async ({ title }) => {
      setCatalogTitle(title);
    },
  });

  useCopilotAction({
    name: "updateBlogPost",
    description: "Updates the blog post content above the product catalog",
    parameters: [
      {
        name: "content",
        type: "string",
        description: "New content for the blog post",
        required: true,
      },
    ],
    handler: async ({ content }) => {
      setBlogPost(content);
    },
  });

  const instructions = `<START> You are a professional e-commerce personal shopping assistant. Please follow these steps strictly:
Information Gathering Phase:
Ask about user's specific shopping preferences (budget, style, purpose)
Confirm user's interested vendors, departments, or product categories
Note any special requirements or restrictions
Product Catalog Update (Must Execute):
Real-time update of product catalog based on user preferences
Display product names, prices, and stock status
List detailed specifications and features of relevant products
Marketing Content Creation (Must Execute):
Create a 300-word blog post including:
Key product highlights and advantages
Usage scenarios for target audience
Specific product recommendations with reasoning
Clear purchase links or call-to-action
Page Theme Setting:
Select appropriate theme based on season/holiday/product type
Ensure visual elements align with product positioning
Please provide confirmation after completing each step and wait for user feedback before proceeding to the next step.
<END>

Optimization Suggestions:

Added clear execution steps and sequence
Included mandatory execution markers
Set specific blog post word count requirement
Added confirmation mechanism
Detailed specific execution content for each step`;

  return (
    <CopilotSidebar
      defaultOpen={true}
      instructions={instructions}
      labels={{
        title: "Personal Shopper",
        initial: "What can I help you find today?",
      }}
      onInProgress={(inProgress) => {
        setLoading(inProgress);
      }}
    >
      <div className="container mx-auto p-6">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-8">
            {/* Product Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card bg-base-100 shadow-xl">
                  {/* Product Image Skeleton */}
                  <div className="skeleton h-64 w-full rounded-t-xl"></div>
                  
                  <div className="card-body p-6 space-y-4">
                    {/* Product Name Skeleton */}
                    <div className="skeleton h-6 w-2/3"></div>
                    
                    {/* Product Description Skeleton - Multiple lines */}
                    <div className="space-y-2">
                      <div className="skeleton h-4 w-full"></div>
                      <div className="skeleton h-4 w-5/6"></div>
                      <div className="skeleton h-4 w-4/6"></div>
                    </div>
                    
                    {/* Buy Now Button Skeleton */}
                    <div className="skeleton h-10 w-24 mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !error && products.length > 0 ? (
          <ProductList products={products} blogPost={blogPost} />
        ) : (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-xl text-gray-500">
              Start chatting with your Personal Shopper to see products
            </p>
          </div>
        )}
      </div>
    </CopilotSidebar>
  );
};

export default ProductApp;
