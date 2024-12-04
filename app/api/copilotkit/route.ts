import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import OpenAI from 'openai';

import { NextRequest } from 'next/server';
import { AvailableFilters } from '../availableFilters/route';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const llmAdapter = new OpenAIAdapter({ openai, model: 'gpt-4o-mini' });

const getFilterDescriptions = async () => {
  try {
    const response = await fetch(
      'https://api.footwayplus.com/v1/inventory/availableFilters',
      {
        method: "GET",
        headers: {
          "X-API-KEY": process.env.FOOTWAY_API_KEY as string,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching filters: ${response.statusText}`);
    }

    const data: AvailableFilters = await response.json();
    return {
      vendors: data.vendors?.values?.map(v => v.name).join(', ') || '',
      departments: data.departments?.values?.map(v => v.name).join(', ') || '',
      productGroups: data.productGroups?.values?.map(v => v.name).join(', ') || '',
      productTypes: data.productTypes?.values?.map(v => v.name).join(', ') || ''
    };
  } catch (error) {
    console.error('Error fetching filters:', error);
    return {
      vendors: '',
      departments: '',
      productGroups: '',
      productTypes: ''
    };
  }
};

const getAvailableFilters = {
  name: "fetchAvailableFilters",
  description: "Fetches a list of available filters for the inventory search API",
  parameters: [],
  handler: async () => {
    return await getFilterDescriptions();
  }
};

const createFetchVendorProductsAction = async () => {
  const filterDescriptions = await getFilterDescriptions();
  
  return {
    name: "fetchVendorProducts",
    description: "Fetches products with various filters including vendor, department, product type, and name, if you are unsure which filters to use, you can use the fetchAvailableFilters action to get a list of available filters",
    parameters: [
      {
        name: "vendor",
        type: "string" as const,
        description: `The vendor to fetch products from. Available vendors: ${filterDescriptions.vendors}`,
        required: false,
      },
      {
        name: "productName",
        type: "string" as const,
        description: "Search by product name (uses trigram similarity)",
        required: false,
      },
      {
        name: "department",
        type: "string" as const,
        description: `Filter by department. Available departments: ${filterDescriptions.departments}`,
        required: false,
      },
      {
        name: "productGroup",
        type: "string" as const,
        description: `Filter by product group. Available product groups: ${filterDescriptions.productGroups}`,
        required: false,
      },
      {
        name: "productType",
        type: "string" as const,
        description: `Filter by product type. Available product types: ${filterDescriptions.productTypes}`,
        required: false,
      },
      {
        name: "page",
        type: "number" as const,
        description: "Page number (1-based)",
        required: false,
      },
      {
        name: "pageSize",
        type: "number" as const,
        description: "Number of items per page (1-10000)",
        required: false,
      }
    ],
    handler: async (args: { [key: string]: string | number }) => {
      const queryParams = new URLSearchParams();

      // Add all provided parameters to query string
      Object.entries(args).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      // Set defaults if not provided
      if (!queryParams.has('pageSize')) {
        queryParams.append('pageSize', '20');
      }
      if (!queryParams.has('page')) {
        queryParams.append('page', '1');
      }
      console.log(queryParams.toString());
      const response = await fetch(
        `https://api.footwayplus.com/v1/inventory/search?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": process.env.FOOTWAY_API_KEY as string,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    },
  };
};

const getRuntimeInstance = async () => {
  const fetchVendorProductsActionWithFilters = await createFetchVendorProductsAction();

  return new CopilotRuntime({
    actions: ({ properties, url }) => {
      return [
        fetchVendorProductsActionWithFilters,
        getAvailableFilters,
      ]
    }
  });
};

export const POST = async (req: NextRequest) => {
  const runtime = await getRuntimeInstance();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: llmAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};